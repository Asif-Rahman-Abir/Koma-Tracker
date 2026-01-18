import { useTrending } from '../hooks/useTrending';
import { useRecommendations } from '../hooks/useRecommendations';
import { HeroCarousel } from '../components/ui/HeroCarousel';
import { Card } from '../components/ui/Card';

export default function Home() {
    // Unify all types (Anime, Manga, Manhwa, Manhua)
    const { data, isLoading: isTrendingLoading, error } = useTrending('UNIFIED');
    const { data: recs, isLoading: isRecsLoading } = useRecommendations('UNIFIED');

    const isLoading = isTrendingLoading || isRecsLoading;

    return (
        <div className="space-y-12 pb-12">
            {isLoading ? (
                <div className="flex h-[50vh] items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
                </div>
            ) : error || !data ? (
                <div className="flex h-[50vh] items-center justify-center text-red-400">
                    Error loading content. Please try again later.
                </div>
            ) : (
                <>
                    {/* Hero Section */}
                    <HeroCarousel items={data.heroes} />

                    {/* For You Section (Personalized Recommendations across all types) */}
                    {recs && recs.length > 0 && (
                        <section className="relative">
                            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-600 to-transparent rounded-full opacity-50" />
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                    For You
                                    <span className="px-2 py-0.5 bg-purple-600/20 text-purple-400 text-[10px] uppercase tracking-widest rounded border border-purple-500/20">Unified Feed</span>
                                </h2>
                            </div>

                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 mb-12">
                                {recs.map((item: any) => (
                                    <Card
                                        key={item.id}
                                        id={item.id}
                                        type={item.type.toLowerCase()}
                                        country={item.countryOfOrigin}
                                        title={item.title.english || item.title.romaji}
                                        image={item.coverImage.large}
                                        rating={item.averageScore}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Popular Section (Trending Mixed) */}
                    <section>
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">Popular Right Now</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 mb-12">
                            {data.popular.map((item: any) => (
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

                    {/* Top Rated Section */}
                    <section>
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">All-Time Top Rated</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 mb-12">
                            {data.topRated.map((item: any) => (
                                <Card
                                    key={item.id}
                                    id={item.id}
                                    type={item.type.toLowerCase()}
                                    country={item.countryOfOrigin}
                                    title={item.title.english || item.title.romaji}
                                    image={item.coverImage.large}
                                    rating={item.averageScore}
                                />
                            ))}
                        </div>
                    </section>

                    {/* Favourites Section */}
                    <section>
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">All Time Favorites</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                            {data.favourites.map((item: any) => (
                                <Card
                                    key={item.id}
                                    id={item.id}
                                    type={item.type.toLowerCase()}
                                    country={item.countryOfOrigin}
                                    title={item.title.english || item.title.romaji}
                                    image={item.coverImage.large}
                                    rating={item.averageScore}
                                />
                            ))}
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}
