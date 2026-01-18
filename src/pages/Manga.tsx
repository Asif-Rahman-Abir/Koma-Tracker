import { useParams } from 'react-router-dom';
import { useSeries } from '../hooks/useSeries';
import { BookOpen, CheckCircle, PlusCircle, Star, Layers } from 'lucide-react';

export default function Manga() {
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
                Error loading manga.
            </div>
        );
    }

    return (
        <div className="-mt-20">
            {/* Banner */}
            <div
                className="h-[40vh] w-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${data.bannerImage || data.coverImage.extraLarge})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-32">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Visuals */}
                    <div className="w-full md:w-1/3 flex-shrink-0">
                        <img
                            src={data.coverImage.extraLarge}
                            alt={data.title.english || data.title.romaji}
                            className="w-48 md:w-64 rounded-xl shadow-2xl ring-4 ring-black/50 mx-auto md:mx-0"
                        />
                        <div className="mt-6 flex flex-col gap-3 max-w-xs mx-auto md:mx-0 md:max-w-64">
                            <button className="flex items-center justify-center gap-2 w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors">
                                <PlusCircle className="w-5 h-5" />
                                Add to Library
                            </button>
                            <button className="flex items-center justify-center gap-2 w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-lg transition-colors">
                                <CheckCircle className="w-5 h-5" />
                                Mark as Read
                            </button>
                        </div>
                    </div>

                    {/* Details & Tracking */}
                    <div className="flex-1 pt-4 md:pt-12">
                        <h1 className="text-4xl font-black text-white mb-2 text-shadow-md">{data.title.english || data.title.romaji}</h1>
                        <div className="text-xl text-neutral-400 mb-6 font-medium">{data.title.native}</div>

                        {/* Genres */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {data.genres?.map((genre: string) => (
                                <span key={genre} className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md border border-white/5">
                                    {genre}
                                </span>
                            ))}
                        </div>

                        {/* Stats Banner */}
                        <div className="flex flex-wrap items-center gap-6 mb-8 text-sm font-medium text-neutral-300 bg-neutral-900/50 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                            <div className="flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                <span className="text-white font-bold">{data.averageScore}%</span> Score
                            </div>
                            <div className="w-px h-4 bg-white/10" />
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-purple-400" />
                                <span className="text-white font-bold">{data.chapters || '?'}</span> Chapters
                            </div>
                            <div className="w-px h-4 bg-white/10" />
                            <div className="flex items-center gap-2">
                                <Layers className="w-5 h-5 text-blue-400" />
                                <span className="text-white font-bold">{data.volumes || '?'}</span> Volumes
                            </div>
                            <div className="w-px h-4 bg-white/10" />
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${data.status === 'RELEASING' ? 'bg-green-500' : 'bg-neutral-500'}`} />
                                <span className="uppercase text-xs font-bold tracking-wider">{data.status}</span>
                            </div>
                        </div>


                        {/* Progress Card */}
                        <div className="bg-neutral-800/50 rounded-xl p-6 mb-8 border border-white/5">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-purple-400" />
                                Reading Progress
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1 text-neutral-300">
                                        <span>Volume Progress</span>
                                        <span className="font-mono">0 / {data.volumes || '?'}</span>
                                    </div>
                                    <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500 w-0" />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-1 text-neutral-300">
                                        <span>Chapter Progress</span>
                                        <span className="font-mono">0 / {data.chapters || '?'}</span>
                                    </div>
                                    <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 w-0" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="prose prose-invert max-w-none text-neutral-300">
                            <h3 className="text-xl font-bold text-white mb-2">Description</h3>
                            <div dangerouslySetInnerHTML={{ __html: data.description }} />
                        </div>

                        {/* Relations Section */}
                        {data.relations?.edges?.length > 0 && (
                            <div className="mt-12">
                                <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-2">Related Content</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {data.relations.edges.map((edge: any) => (
                                        <div key={edge.node.id} className="group cursor-pointer">
                                            <div className="relative aspect-[2/3] overflow-hidden rounded-lg mb-2">
                                                <img
                                                    src={edge.node.coverImage.medium}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    alt={edge.node.title.romaji}
                                                />
                                                <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/80 rounded text-[10px] font-bold uppercase text-white backdrop-blur-sm">
                                                    {edge.node.type}
                                                </div>
                                            </div>
                                            <div className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-1">{edge.relationType?.replace('_', ' ')}</div>
                                            <div className="line-clamp-2 text-sm font-medium text-neutral-200 group-hover:text-white transition-colors">{edge.node.title.romaji}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
