import { useQuery } from '@tanstack/react-query';
import { fetchAniList } from '../lib/api';

const TRENDING_QUERY = `
query($type: MediaType, $country: CountryCode) {
  trending: Page(page: 1, perPage: 1) {
    media(sort: TRENDING_DESC, type: $type, countryOfOrigin: $country) {
      id
      type
      countryOfOrigin
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
  popular: Page(page: 1, perPage: 6) {
    media(sort: POPULARITY_DESC, type: $type, countryOfOrigin: $country) {
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
  topRated: Page(page: 1, perPage: 6) {
    media(sort: SCORE_DESC, type: $type, countryOfOrigin: $country) {
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
  favourites: Page(page: 1, perPage: 6) {
    media(sort: FAVOURITES_DESC, type: $type, countryOfOrigin: $country) {
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

export type ContentFormat = 'ANIME' | 'MANGA' | 'MANHWA' | 'MANHUA';

interface FilterState {
  type: 'ANIME' | 'MANGA';
  country?: 'JP' | 'KR' | 'CN';
}

function getFilterVars(format: ContentFormat): FilterState {
  switch (format) {
    case 'ANIME': return { type: 'ANIME' };
    case 'MANGA': return { type: 'MANGA', country: 'JP' };
    case 'MANHWA': return { type: 'MANGA', country: 'KR' };
    case 'MANHUA': return { type: 'MANGA', country: 'CN' };
    default: return { type: 'MANGA' };
  }
}

export function useTrending(format: ContentFormat) {
  const vars = getFilterVars(format);

  return useQuery({
    queryKey: ['trending', format],
    queryFn: async () => {
      const data = await fetchAniList(TRENDING_QUERY, vars);
      return {
        hero: data.trending.media[0],
        popular: data.popular.media,
        topRated: data.topRated.media,
        favourites: data.favourites.media,
      };
    },
  });
}
