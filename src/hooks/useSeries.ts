import { useQuery } from '@tanstack/react-query';
import { fetchAniList } from '../lib/api';

const SERIES_QUERY = `
query($id: Int) {
  Media(id: $id) {
    id
    title {
      romaji
      english
      native
    }
    coverImage {
      extraLarge
    }
    bannerImage
    description
    status
    countryOfOrigin
    volumes
    chapters
    averageScore
    genres
    relations {
      edges {
        relationType
        node {
          id
          title {
            romaji
          }
          coverImage {
            medium
          }
          type
        }
      }
    }
  }
}
`;

export function useSeries(id: string | undefined) {
  return useQuery({
    queryKey: ['series', id],
    queryFn: async () => {
      if (!id) throw new Error('No ID provided');
      const data = await fetchAniList(SERIES_QUERY, { id: parseInt(id) });
      return data.Media;
    },
    enabled: !!id,
  });
}
