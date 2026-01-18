import { useParams } from 'react-router-dom';
import { useSeries } from '../hooks/useSeries';
import { Star, BookOpen, Layers } from 'lucide-react';

export default function Series() {
    const { id } = useParams();
    const { data, isLoading, error } = useSeries(id);

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
                Error loading series.
            </div>
        );
    }

    return (
        <div className="-mt-20"> {/* Negative margin to go behind navbar if transparent, but here we just want to leverage the banner */}

            {/* Banner */}
            <div
                className="h-[40vh] w-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${data.bannerImage || data.coverImage.extraLarge})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-32">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Cover Image */}
                    <div className="flex-shrink-0">
                        <img
                            src={data.coverImage.extraLarge}
                            alt={data.title.english || data.title.romaji}
                            className="w-48 md:w-64 rounded-xl shadow-2xl ring-4 ring-black/50"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1 pt-4 md:pt-12">
                        <h1 className="text-4xl font-black text-white mb-2 text-shadow-md">
                            {data.title.english || data.title.romaji}
                        </h1>
                        <h2 className="text-lg text-neutral-400 mb-6">{data.title.native}</h2>

                        <div className="flex flex-wrap gap-3 mb-6">
                            {data.genres.map((genre: string) => (
                                <span key={genre} className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md">
                                    {genre}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center gap-6 mb-8 text-sm font-medium text-neutral-300">
                            <div className="flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                <span>{data.averageScore}% Score</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-purple-400" />
                                <span>{data.chapters || '?'} Chapters</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Layers className="w-5 h-5 text-blue-400" />
                                <span>{data.volumes || '?'} Volumes</span>
                            </div>
                        </div>

                        <div className="prose prose-invert max-w-none text-neutral-300">
                            <div dangerouslySetInnerHTML={{ __html: data.description }} />
                        </div>

                        {/* Status Button Placeholder */}
                        <div className="mt-8">
                            <button className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-neutral-200 transition-colors">
                                Add to Library
                            </button>
                        </div>
                    </div>
                </div>

                {/* Relations Section */}
                {data.relations?.edges?.length > 0 && (
                    <div className="mt-16">
                        <h3 className="text-2xl font-bold mb-6 border-b border-white/10 pb-2">Relations</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                            {data.relations.edges.map((edge: any) => (
                                <div key={edge.node.id} className="bg-neutral-900 rounded-lg p-3 hover:bg-neutral-800 transition-colors">
                                    <img
                                        src={edge.node.coverImage.medium}
                                        className="w-full aspect-[2/3] object-cover rounded mb-2"
                                        alt={edge.node.title.romaji}
                                    />
                                    <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1">{edge.relationType?.replace('_', ' ')}</div>
                                    <div className="line-clamp-1 text-sm font-medium">{edge.node.title.romaji}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
