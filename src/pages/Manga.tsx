import { useParams } from 'react-router-dom';
import { useSeries } from '../hooks/useSeries';
import { BookOpen, CheckCircle, PlusCircle } from 'lucide-react';

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
        <div className="mx-auto max-w-5xl px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">

                {/* Visuals */}
                <div className="w-full md:w-1/3">
                    <img
                        src={data.coverImage.extraLarge}
                        alt={data.title.english || data.title.romaji}
                        className="w-full rounded-xl shadow-2xl"
                    />
                    <div className="mt-6 flex flex-col gap-3">
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
                <div className="w-full md:w-2/3">
                    <h1 className="text-4xl font-black text-white mb-2">{data.title.english || data.title.romaji}</h1>
                    <div className="text-xl text-neutral-400 mb-6 font-medium">{data.title.native}</div>

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

                    <div className="prose prose-invert max-w-none">
                        <h3 className="text-xl font-bold text-white mb-2">Description</h3>
                        <div dangerouslySetInnerHTML={{ __html: data.description }} />
                    </div>
                </div>

            </div>
        </div>
    );
}
