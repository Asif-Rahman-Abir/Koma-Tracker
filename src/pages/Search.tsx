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
            <div className="mx-auto max-w-7xl">
                {isLoading ? (
                    <div className="flex h-40 items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
                    </div>
                ) : isError ? (
                    <div className="text-center text-red-500">Error searching content. Please try again.</div>
                ) : data && data.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        {data.map((item: any) => (
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
