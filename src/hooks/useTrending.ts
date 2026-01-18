import { useQuery } from '@tanstack/react-query';
import { fetchAniList } from '../lib/api';

const TRENDING_QUERY = `
query {
  trending: Page(page: 1, perPage: 1) {
    media(sort: TRENDING_DESC, type: MANGA) {
      id
      title {
        romaji
        english
      }
      coverImage {
        extraLarge
      }
      bannerImage
      description
      averageScore
    }
  }
  popular: Page(page: 1, perPage: 12) {
    media(sort: POPULARITY_DESC, type: MANGA) {
      id
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

export function useTrending() {
    return useQuery({
        queryKey: ['trending'],
        queryFn: async () => {
            const data = await fetchAniList(TRENDING_QUERY);
            return {
                hero: data.trending.media[0],
                popular: data.popular.media,
            };
        },
    });
}
