// AniList GraphQL API Client

const ANILIST_API_URL = 'https://graphql.anilist.co';

export async function fetchAniList(query: string, variables: any = {}) {
    const response = await fetch(ANILIST_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables,
        }),
    });

    const json = await response.json();

    if (!response.ok) {
        throw new Error(json.errors?.[0]?.message || 'AniList API Error');
    }

    return json.data;
}
