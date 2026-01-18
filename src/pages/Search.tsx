import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearch } from '../hooks/useSearch';
import { Card } from '../components/ui/Card';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '../components/ui/Input';

export default function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const [query, setQuery] = useState(initialQuery);
    const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

    // Custom debounce logic
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
            if (query) {
                setSearchParams({ q: query });
            } else {
                setSearchParams({});
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query, setSearchParams]);

    const { data, isLoading, isError } = useSearch(debouncedQuery);

    const hasResults = data && (
        data.anime.length > 0 ||
        data.manga.length > 0 ||
        data.manhwa.length > 0 ||
        data.manhua.length > 0
    );

    return (
        <div className="min-h-[80vh] px-4 py-8">
            {/* Search Header */}
            <div className="mx-auto max-w-2xl mb-12">
                <h1 className="text-3xl font-bold text-center mb-8">Search Collection</h1>
                <div className="relative">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500 z-10" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search anime, manga, manhwa..."
                        className="pl-12 !py-4 rounded-full text-lg shadow-lg"
                        autoFocus
                    />
                </div>
            </div>

            {/* Results Grid */}
            <div className="mx-auto max-w-7xl space-y-16">
                {isLoading ? (
                    <div className="flex h-40 items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
                    </div>
                ) : isError ? (
                    <div className="text-center text-red-500">Error searching content. Please try again.</div>
                ) : hasResults ? (
                    <>
                        {/* Anime Section */}
                        {data.anime.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-6 pl-2 border-l-4 border-purple-500">Anime</h2>
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                                    {data.anime.map((item: any) => (
                                        <Card
                                            key={item.id}
                                            id={item.id}
                                            type={item.type.toLowerCase()}
                                            country={item.countryOfOrigin}
                                            title={item.title.english || item.title.romaji}
                                            image={item.coverImage.large}
                                            rating={item.averageScore}
                                            rank={item.rankings?.[0]?.rank}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Manga Section */}
                        {data.manga.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-6 pl-2 border-l-4 border-blue-500">Manga</h2>
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                                    {data.manga.map((item: any) => (
                                        <Card
                                            key={item.id}
                                            id={item.id}
                                            type={item.type.toLowerCase()}
                                            country={item.countryOfOrigin}
                                            title={item.title.english || item.title.romaji}
                                            image={item.coverImage.large}
                                            rating={item.averageScore}
                                            rank={item.rankings?.[0]?.rank}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Manhwa Section */}
                        {data.manhwa.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-6 pl-2 border-l-4 border-green-500">Manhwa</h2>
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                                    {data.manhwa.map((item: any) => (
                                        <Card
                                            key={item.id}
                                            id={item.id}
                                            type={item.type.toLowerCase()}
                                            country={item.countryOfOrigin}
                                            title={item.title.english || item.title.romaji}
                                            image={item.coverImage.large}
                                            rating={item.averageScore}
                                            rank={item.rankings?.[0]?.rank}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Manhua Section */}
                        {data.manhua.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-6 pl-2 border-l-4 border-yellow-500">Manhua</h2>
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                                    {data.manhua.map((item: any) => (
                                        <Card
                                            key={item.id}
                                            id={item.id}
                                            type={item.type.toLowerCase()}
                                            country={item.countryOfOrigin}
                                            title={item.title.english || item.title.romaji}
                                            image={item.coverImage.large}
                                            rating={item.averageScore}
                                            rank={item.rankings?.[0]?.rank}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                ) : debouncedQuery ? (
                    <div className="text-center text-neutral-500 mt-12">
                        No results found for "{debouncedQuery}"
                    </div>
                ) : (
                    <div className="text-center text-neutral-600 mt-12">
                        Type something to start searching...
                    </div>
                )}
            </div>
        </div>
    );
}
