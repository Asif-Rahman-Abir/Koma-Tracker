import { Link } from 'react-router-dom';
import { PlayCircle, Info } from 'lucide-react';

interface HeroProps {
    title: string;
    description: string;
    image: string;
    id: number;
}

export function Hero({ title, description, image, id }: HeroProps) {
    return (
        <div className="relative h-[60vh] w-full overflow-hidden rounded-3xl mt-6">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                style={{ backgroundImage: `url(${image})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col justify-end p-8 sm:p-12 md:max-w-2xl">
                <span className="mb-4 inline-flex items-center rounded-full bg-purple-500/20 px-3 py-1 text-xs font-medium text-purple-300 backdrop-blur-md border border-purple-500/20">
                    Top Trending
                </span>
                <h1 className="mb-4 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl text-shadow-lg">
                    {title}
                </h1>
                <p className="mb-8 line-clamp-3 text-base text-neutral-300 sm:text-lg">
                    {description}
                </p>

                <div className="flex items-center gap-4">
                    <Link
                        to={`/series/${id}`}
                        className="group flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-black transition-transform hover:scale-105 active:scale-95"
                    >
                        <PlayCircle className="h-5 w-5 fill-black" />
                        Start Reading
                    </Link>
                    <Link
                        to={`/series/${id}`}
                        className="group flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
                    >
                        <Info className="h-5 w-5" />
                        Details
                    </Link>
                </div>
            </div>
        </div>
    );
}
