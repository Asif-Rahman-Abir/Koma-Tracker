import { Link } from "react-router-dom";
import { Star } from "lucide-react";

interface CardProps {
    id: number;
    title: string;
    image: string;
    type: string;
    country?: string;
    rating?: number;
    rank?: number;
}

export function Card({ id, title, image, type, country, rating, rank }: CardProps) {
    const getFormatBadge = () => {
        if (type.toUpperCase() === 'ANIME') return 'Anime';
        switch (country) {
            case 'KR': return 'Manhwa';
            case 'CN': return 'Manhua';
            case 'JP': return 'Manga';
            default: return 'Manga';
        }
    };

    const formatBadge = getFormatBadge();

    return (
        <Link
            to={`/${type.toLowerCase()}/${id}`}
            className="group relative flex aspect-[2/3] w-full flex-col overflow-hidden rounded-xl bg-neutral-900 transition-all hover:ring-2 hover:ring-purple-500/50"
        >
            {/* Image */}
            <div className="relative h-full w-full overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
            </div>

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                {rank && rank <= 10 && (
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-yellow-500 text-xs font-bold text-black shadow-lg">
                        #{rank}
                    </div>
                )}
                <div className="px-2 py-0.5 rounded bg-purple-600/90 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm uppercase tracking-wider">
                    {formatBadge}
                </div>
            </div>

            {rating && (
                <div className="absolute top-2 right-2 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                    {rating}%
                </div>
            )}

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="line-clamp-2 text-sm font-bold text-white transition-colors group-hover:text-purple-300">
                    {title}
                </h3>
            </div>
        </Link>
    );
}
