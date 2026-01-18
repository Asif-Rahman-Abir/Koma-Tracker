import { useQuery } from '@tanstack/react-query';
import { fetchAniList } from '../lib/api';

const SEARCH_QUERY = `
query($search: String) {
  Page(page: 1, perPage: 20) {
    media(search: $search, sort: POPULARITY_DESC, type: MANGA) {
      id
      type
      title {
        romaji
        english
      }
      coverImage {
        large
      }
      averageScore
      rankings {
        rank
        type
      }
    }
  }
}
`;

export function useSearch(query: string) {
    return useQuery({
        queryKey: ['search', query],
        queryFn: async () => {
            if (!query) return [];
            const data = await fetchAniList(SEARCH_QUERY, { search: query });
            return data.Page.media;
        },
        enabled: !!query,
        staleTime: 1000 * 60, // 1 minute
    });
}
