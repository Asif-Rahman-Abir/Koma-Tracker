import { useQuery } from '@tanstack/react-query';
import { fetchAniList } from '../lib/api';

const SEARCH_QUERY = `
query($search: String) {
  anime: Page(page: 1, perPage: 6) {
    media(search: $search, sort: POPULARITY_DESC, type: ANIME) {
      id
      type
      countryOfOrigin
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
  manga: Page(page: 1, perPage: 6) {
    media(search: $search, sort: POPULARITY_DESC, type: MANGA, countryOfOrigin: JP) {
      id
      type
      countryOfOrigin
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
  manhwa: Page(page: 1, perPage: 6) {
    media(search: $search, sort: POPULARITY_DESC, type: MANGA, countryOfOrigin: KR) {
      id
      type
      countryOfOrigin
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
  manhua: Page(page: 1, perPage: 6) {
    media(search: $search, sort: POPULARITY_DESC, type: MANGA, countryOfOrigin: CN) {
      id
      type
      countryOfOrigin
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
      if (!query) return null;
      const data = await fetchAniList(SEARCH_QUERY, { search: query });
      return {
        anime: data.anime.media,
        manga: data.manga.media,
        manhwa: data.manhwa.media,
        manhua: data.manhua.media,
      };
    },
    enabled: !!query,
    staleTime: 1000 * 60, // 1 minute
  });
}
