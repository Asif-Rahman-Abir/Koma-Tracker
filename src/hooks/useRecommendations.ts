import { useQuery } from '@tanstack/react-query';
import { useLibrary } from './useLibrary';
import { fetchAniList } from '../lib/api';
import { type ContentFormat } from './useTrending';

const RECOMMENDATIONS_QUERY = `
query($genres: [String], $type: MediaType, $country: CountryCode) {
  Page(page: 1, perPage: 20) {
    media(genre_in: $genres, type: $type, countryOfOrigin: $country, sort: TRENDING_DESC, isAdult: false) {
      id
      title {
        romaji
        english
      }
      coverImage {
        large
        extraLarge
      }
      type
      format
      averageScore
      countryOfOrigin
      genres
    }
  }
}
`;

function getFilterParams(format: ContentFormat) {
    switch (format) {
        case 'UNIFIED': return {};
        case 'ANIME': return { type: 'ANIME' as const };
        case 'MANGA': return { type: 'MANGA' as const, country: 'JP' as const };
        case 'MANHWA': return { type: 'MANGA' as const, country: 'KR' as const };
        case 'MANHUA': return { type: 'MANGA' as const, country: 'CN' as const };
        default: return { type: 'MANGA' as const };
    }
}

export function useRecommendations(format: ContentFormat = 'ANIME') {
    const { library, isLoading: isLibLoading } = useLibrary();
    const { type, country } = getFilterParams(format);

    return useQuery({
        queryKey: ['recommendations', library.length, format],
        queryFn: async () => {
            // 1. Filter library by the EXACT format
            const itemsOfFormat = library.filter(item => {
                if (format === 'UNIFIED') return true;
                if (format === 'ANIME') return item.media_type === 'ANIME';
                if (format === 'MANGA') return item.media_type === 'MANGA';
                if (format === 'MANHWA') return item.media_type === 'MANHWA';
                if (format === 'MANHUA') return item.media_type === 'MANHUA';
                return false;
            });

            if (itemsOfFormat.length === 0) {
                // FALLBACK: If user has no items of this specific format, fetch trending for this format
                const data = await fetchAniList(RECOMMENDATIONS_QUERY, { type, country });
                const libraryIds = new Set(library.map(i => i.media_id));
                return data.Page.media.filter((m: any) => !libraryIds.has(m.id));
            }

            // 2. Fetch professional recommendations for the top 3 most recently updated items OF THIS FORMAT
            const recentItems = [...itemsOfFormat]
                .sort((a, b) => {
                    const dateA = a.updated_at ? new Date(a.updated_at).getTime() : -Infinity;
                    const dateB = b.updated_at ? new Date(b.updated_at).getTime() : -Infinity;
                    return dateB - dateA;
                })
                .slice(0, 3);

            const promises = recentItems.map(item =>
                fetchAniList(`
                    query($id: Int) {
                        Media(id: $id) {
                            recommendations(perPage: 5, sort: RATING_DESC) {
                                nodes {
                                    mediaRecommendation {
                                        id
                                        title { romaji english }
                                        coverImage { large extraLarge }
                                        type
                                        format
                                        averageScore
                                        countryOfOrigin
                                    }
                                }
                            }
                        }
                    }
                `, { id: item.media_id })
            );

            const results = await Promise.all(promises);

            // Flatten and filter
            const recommended = results.flatMap(res =>
                res.Media.recommendations.nodes
                    .map((n: any) => n.mediaRecommendation)
                    .filter(Boolean)
            );

            // 1. Remove duplicates
            const unique = Array.from(new Map(recommended.map((m: any) => [m.id, m])).values());

            // 2. Filter out items already in library and ensure they match the format (country/type)
            const libraryIds = new Set(library.map(i => i.media_id));
            const filtered = unique.filter((m: any) => {
                if (libraryIds.has(m.id)) return false;

                // Ensure the recommendation matches the format
                if (format === 'UNIFIED') return true;
                if (format === 'ANIME') return m.type === 'ANIME';
                if (format === 'MANGA') return m.type === 'MANGA' && m.countryOfOrigin === 'JP';
                if (format === 'MANHWA') return m.type === 'MANGA' && m.countryOfOrigin === 'KR';
                if (format === 'MANHUA') return m.type === 'MANGA' && m.countryOfOrigin === 'CN';
                return false;
            });

            // If we filtered out too many, we could potentially fill from trending, but let's see how this performs.
            return filtered.slice(0, 12);
        },
        enabled: !isLibLoading && !!library,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}
