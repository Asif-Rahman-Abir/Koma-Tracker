import { useParams, Link } from 'react-router-dom';
import { useSeries } from '../hooks/useSeries';
import { useLibrary } from '../hooks/useLibrary';
import { BookOpen, CheckCircle, PlusCircle, Star, Layers, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Manga() {
    const { id } = useParams();
    const { data, isLoading: isSeriesLoading, error } = useSeries(id);
    const { library, upsert, remove, isUpdating } = useLibrary();

    const mediaId = id ? parseInt(id) : null;
    const libraryItem = library.find(item => item.media_id === mediaId);

    const [volProgress, setVolProgress] = useState(0);
    const [chProgress, setChProgress] = useState(0);

    useEffect(() => {
        if (libraryItem) {
            setVolProgress(libraryItem.progress_volume || 0);
            setChProgress(libraryItem.progress_chapter || 0);
        }
    }, [libraryItem]);

    if (isSeriesLoading) {
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

    const handleSync = async (updates: any) => {
        if (!mediaId) return;
        await upsert({
            media_id: mediaId,
            media_type: 'MANGA',
            title: data.title.english || data.title.romaji,
            cover_image: data.coverImage.large || data.coverImage.extraLarge,
            total_volumes: data.volumes,
            total_chapters: data.chapters,
            status: updates.status || libraryItem?.status || 'READING',
            progress_volume: updates.progress_volume ?? volProgress,
            progress_chapter: updates.progress_chapter ?? chProgress,
        });
    };

    const DIRECT_TYPES = ['PREQUEL', 'SEQUEL', 'PARENT', 'ADAPTATION', 'SIDE_STORY', 'SPIN_OFF'];

    const relations = data.relations?.edges || [];
    const directRelations = relations.filter((edge: any) => DIRECT_TYPES.includes(edge.relationType));
    const otherRelations = relations.filter((edge: any) => !DIRECT_TYPES.includes(edge.relationType));

    const isAdded = !!libraryItem;

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
                            {!isAdded ? (
                                <button
                                    onClick={() => handleSync({ status: 'PLAN_TO_READ' })}
                                    disabled={isUpdating}
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                                >
                                    <PlusCircle className="w-5 h-5" />
                                    Add to Library
                                </button>
                            ) : (
                                <button
                                    onClick={() => remove(mediaId!)}
                                    disabled={isUpdating}
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-red-900/50 hover:bg-red-800 text-red-200 font-bold rounded-lg transition-colors border border-red-500/20 disabled:opacity-50"
                                >
                                    <Trash2 className="w-5 h-5" />
                                    Remove from Library
                                </button>
                            )}

                            <button
                                onClick={() => handleSync({ status: 'COMPLETED', progress_chapter: data.chapters, progress_volume: data.volumes })}
                                className="flex items-center justify-center gap-2 w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-lg transition-colors"
                            >
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

                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-sm mb-2 text-neutral-300">
                                        <span>Volume Progress</span>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="number"
                                                value={volProgress}
                                                onChange={(e) => {
                                                    const val = Math.min(parseInt(e.target.value) || 0, data.volumes || 999);
                                                    setVolProgress(val);
                                                    handleSync({ progress_volume: val });
                                                }}
                                                className="w-16 bg-black/40 border border-white/10 rounded px-2 py-0.5 text-center text-purple-400 font-bold focus:outline-none focus:border-purple-500"
                                            />
                                            <span className="font-mono opacity-50">/ {data.volumes || '?'}</span>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-purple-500 transition-all duration-300"
                                            style={{ width: `${data.volumes ? (volProgress / data.volumes) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-2 text-neutral-300">
                                        <span>Chapter Progress</span>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="number"
                                                value={chProgress}
                                                onChange={(e) => {
                                                    const val = Math.min(parseInt(e.target.value) || 0, data.chapters || 9999);
                                                    setChProgress(val);
                                                    handleSync({ progress_chapter: val });
                                                }}
                                                className="w-16 bg-black/40 border border-white/10 rounded px-2 py-0.5 text-center text-blue-400 font-bold focus:outline-none focus:border-blue-500"
                                            />
                                            <span className="font-mono opacity-50">/ {data.chapters || '?'}</span>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 transition-all duration-300"
                                            style={{ width: `${data.chapters ? (chProgress / data.chapters) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="prose prose-invert max-w-none text-neutral-300">
                            <h3 className="text-xl font-bold text-white mb-2">Description</h3>
                            <div dangerouslySetInnerHTML={{ __html: data.description }} />
                        </div>

                        {/* Relations Sections */}
                        <div className="space-y-12 mt-12">
                            {directRelations.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-2">Direct Relations</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {directRelations.map((edge: any) => (
                                            <Link
                                                key={edge.node.id}
                                                to={`/${edge.node.type.toLowerCase()}/${edge.node.id}`}
                                                className="group cursor-pointer"
                                            >
                                                <div className="relative aspect-[2/3] overflow-hidden rounded-lg mb-2 shadow-lg">
                                                    <img
                                                        src={edge.node.coverImage.medium}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        alt={edge.node.title.romaji}
                                                    />
                                                    <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-purple-600 rounded text-[10px] font-bold uppercase text-white shadow-xl">
                                                        {edge.node.type}
                                                    </div>
                                                </div>
                                                <div className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-1">{edge.relationType?.replace('_', ' ')}</div>
                                                <div className="line-clamp-2 text-sm font-medium text-neutral-200 group-hover:text-white transition-colors">{edge.node.title.romaji}</div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {otherRelations.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-2">Related Content</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 opacity-80 hover:opacity-100 transition-opacity">
                                        {otherRelations.map((edge: any) => (
                                            <Link
                                                key={edge.node.id}
                                                to={`/${edge.node.type.toLowerCase()}/${edge.node.id}`}
                                                className="group cursor-pointer"
                                            >
                                                <div className="relative aspect-[2/3] overflow-hidden rounded-lg mb-2">
                                                    <img
                                                        src={edge.node.coverImage.medium}
                                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                                        alt={edge.node.title.romaji}
                                                    />
                                                    <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/80 rounded text-[10px] font-bold uppercase text-white backdrop-blur-sm">
                                                        {edge.node.type}
                                                    </div>
                                                </div>
                                                <div className="text-xs text-neutral-500 font-bold uppercase tracking-wider mb-1">{edge.relationType?.replace('_', ' ')}</div>
                                                <div className="line-clamp-2 text-sm font-medium text-neutral-400 group-hover:text-white transition-colors">{edge.node.title.romaji}</div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
