import { useState } from 'react';
import { useTrending, type ContentFormat } from '../hooks/useTrending';
import { Hero } from '../components/ui/Hero';
import { Card } from '../components/ui/Card';
import clsx from 'clsx';

const TABS: { label: string; value: ContentFormat }[] = [
    { label: 'Anime', value: 'ANIME' },
    { label: 'Manga', value: 'MANGA' },
    { label: 'Manhwa', value: 'MANHWA' },
    { label: 'Manhua', value: 'MANHUA' },
];

export default function Home() {
    const [activeTab, setActiveTab] = useState<ContentFormat>('MANHWA');
    const { data, isLoading, error } = useTrending(activeTab);

    return (
        <div className="space-y-8 pb-12">

            {/* Tab Switcher */}
            <div className="flex justify-center mt-4">
                <div className="flex items-center gap-1 rounded-full bg-neutral-900/50 p-1.5 border border-white/5 backdrop-blur-md">
                    {TABS.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setActiveTab(tab.value)}
                            className={clsx(
                                'rounded-full px-6 py-2 text-sm font-bold transition-all',
                                activeTab === tab.value
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20'
                                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

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
                    {/* We only show Hero if there's data. Usually hero uses the #1 trending item */}
                    {data.hero && (
                        <Hero
                            id={data.hero.id}
                            title={data.hero.title.english || data.hero.title.romaji}
                            description={data.hero.description?.replace(/<[^>]*>/g, '') || ''}
                            image={data.hero.bannerImage || data.hero.coverImage.extraLarge}
                        />
                    )}

                    {/* Popular Section */}
                    <section>
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">Popular {TABS.find(t => t.value === activeTab)?.label}</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 mb-12">
                            {data.popular.map((item: any) => (
                                <Card
                                    key={item.id}
                                    id={item.id}
                                    type={item.type.toLowerCase()} // 'anime' or 'manga'
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
                            <h2 className="text-2xl font-bold text-white">Top Rated</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 mb-12">
                            {data.topRated.map((item: any) => (
                                <Card
                                    key={item.id}
                                    id={item.id}
                                    type={item.type.toLowerCase()}
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
