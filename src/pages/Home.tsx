import { useTrending } from '../hooks/useTrending';
import { Hero } from '../components/ui/Hero';
import { Card } from '../components/ui/Card';

export default function Home() {
    const { data, isLoading, error } = useTrending();

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex h-[50vh] items-center justify-center text-red-400">
                Error loading content. Please try again later.
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-12">
            {/* Hero Section */}
            {data.hero && (
                <Hero
                    id={data.hero.id}
                    title={data.hero.title.english || data.hero.title.romaji}
                    description={data.hero.description?.replace(/<[^>]*>/g, '') || ''} // Strip HTML
                    image={data.hero.bannerImage || data.hero.coverImage.extraLarge}
                />
            )}

            {/* Popular Section */}
            <section>
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Popular Now</h2>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {data.popular.map((item: any) => (
                        <Card
                            key={item.id}
                            id={item.id}
                            type="manga"
                            title={item.title.english || item.title.romaji}
                            image={item.coverImage.large}
                            rating={item.averageScore}
                            rank={item.rankings?.[0]?.rank} // Optional rank
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
