import { useQuery } from '@tanstack/react-query';
import { useLibrary } from './useLibrary';
import { fetchAniList } from '../lib/api';

const RECOMMENDATIONS_QUERY = `
query($genres: [String], $type: MediaType) {
  Page(page: 1, perPage: 20) {
    media(genre_in: $genres, type: $type, sort: TRENDING_DESC, isAdult: false) {
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

export function useRecommendations(type: 'ANIME' | 'MANGA' = 'ANIME') {
    const { library, isLoading: isLibLoading } = useLibrary();

    return useQuery({
        queryKey: ['recommendations', library.length, type],
        queryFn: async () => {
            if (library.length === 0) {
                // If library is empty, fetch general trending
                const data = await fetchAniList(RECOMMENDATIONS_QUERY, { type });
                return data.Page.media;
            }

            // Re-evaluating: Let's fetch recommendations for the top 3 most recently updated items
            const recentItems = [...library]
                .sort((a, b) => {
                    const dateA = a.updated_at ? new Date(a.updated_at).getTime() : -Infinity;
                    const dateB = b.updated_at ? new Date(b.updated_at).getTime() : -Infinity;
                    return dateB - dateA;
                })
                .slice(0, 3);

            if (recentItems.length === 0) return [];

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
            const unique = Array.from(new Map(recommended.map(m => [m.id, m])).values());

            // 2. Filter out items already in library
            const libraryIds = new Set(library.map(i => i.media_id));
            const filtered = unique.filter(m => !libraryIds.has(m.id) && m.type === type);

            return filtered.slice(0, 12);
        },
        enabled: !isLibLoading && !!library,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}
