import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface HeroItem {
    id: number;
    title: {
        romaji: string;
        english?: string;
    };
    description: string;
    bannerImage?: string;
    coverImage: {
        extraLarge: string;
    };
    type: string;
}

interface HeroCarouselProps {
    items: HeroItem[];
}

export function HeroCarousel({ items }: HeroCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const nextSlide = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % items.length);
    }, [items.length]);

    const prevSlide = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
    }, [items.length]);

    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [nextSlide, isPaused]);

    if (!items || items.length === 0) return null;

    return (
        <div
            className="relative h-[65vh] w-full overflow-hidden rounded-3xl mt-6 group bg-black"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Slides */}
            {items.map((item, index) => (
                <div
                    key={item.id}
                    className={clsx(
                        "absolute inset-0 transition-all duration-1000 ease-in-out",
                        index === activeIndex ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-105 pointer-events-none"
                    )}
                >
                    {/* Background */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-linear"
                        style={{
                            backgroundImage: `url(${item.bannerImage || item.coverImage.extraLarge})`,
                            transform: index === activeIndex ? 'scale(1.1)' : 'scale(1)'
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex h-full flex-col justify-end p-8 sm:p-12 md:max-w-3xl pb-16 sm:pb-20">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="inline-flex items-center rounded-full bg-purple-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-purple-300 backdrop-blur-md border border-purple-500/20">
                                Trending {item.type}
                            </span>
                        </div>

                        <h1 className="mb-4 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl text-shadow-xl line-clamp-2">
                            {item.title.english || item.title.romaji}
                        </h1>

                        <p className="mb-8 line-clamp-3 text-sm sm:text-base text-neutral-300/90 leading-relaxed max-w-xl">
                            {item.description?.replace(/<[^>]*>/g, '') || 'No description available.'}
                        </p>

                        <div className="flex items-center gap-4">
                            <Link
                                to={`/${item.type.toLowerCase()}/${item.id}`}
                                className="group flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-black text-black transition-all hover:bg-purple-400 hover:text-white active:scale-95 shadow-2xl shadow-white/10"
                            >
                                <PlayCircle className="h-5 w-5 fill-current" />
                                {item.type === 'ANIME' ? 'Watch Now' : 'Start Reading'}
                            </Link>
                            <Link
                                to={`/${item.type.toLowerCase()}/${item.id}`}
                                className="group flex items-center gap-3 rounded-xl bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95 border border-white/10"
                            >
                                <Info className="h-5 w-5" />
                                Details
                            </Link>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Controls */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={prevSlide}
                    className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/5 text-white hover:bg-purple-600 transition-colors pointer-events-auto"
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={nextSlide}
                    className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/5 text-white hover:bg-purple-600 transition-colors pointer-events-auto"
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-10 left-12 flex items-center gap-3 z-20">
                {items.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={clsx(
                            "h-1.5 transition-all duration-300 rounded-full",
                            index === activeIndex ? "w-8 bg-purple-500 shadow-lg shadow-purple-500/50" : "w-2 bg-white/30 hover:bg-white/50"
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
