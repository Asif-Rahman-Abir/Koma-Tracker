import { X, Maximize2, Minimize2, Server, ChevronRight, Search, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface PlayerModalProps {
    anilistId: number;
    idMal?: number;
    episode: number;
    onClose: () => void;
    title?: string;
}

const SERVERS = [
    { id: 'youtube_muse', name: 'Muse Asia (Legal/YouTube)', type: 'search', url: (_id: number, _mal: number | undefined, ep: number, title?: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(`Muse Asia ${title} episode ${ep}`)}` },
    { id: 'vidsrc_me', name: 'VidSrc (Pro)', type: 'embed', url: (id: number, _mal: number | undefined, ep: number) => `https://vidsrc.me/embed/anime?anilist=${id}&episode=${ep}` },
    { id: 'vidlink_mal', name: 'VidLink (MAL-based)', type: 'embed', url: (_id: number, mal: number | undefined, ep: number) => mal ? `https://vidlink.pro/anime/${mal}/${ep}` : `https://vidlink.pro/embed/anime/${_id}/${ep}` },
    { id: 'anilistplayer', name: 'AniPlayer (Multi)', type: 'embed', url: (id: number, _mal: number | undefined, ep: number) => `https://anilistplayer.com/player/index.php?id=${id}&ep=${ep}` },
];

export function PlayerModal({ anilistId, idMal, episode, onClose, title }: PlayerModalProps) {
    const [isFullWidth, setIsFullWidth] = useState(false);
    const [activeServer, setActiveServer] = useState(0);

    const currentServer = SERVERS[activeServer];
    const playerUrl = currentServer.url(anilistId, idMal, episode, title);

    const switchServer = () => {
        setActiveServer((prev) => (prev + 1) % SERVERS.length);
    };

    const googleSearchUrl = `https://www.google.com/search?q=watch+${encodeURIComponent(title || '')}+episode+${episode}+online+free`;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-none">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/95 backdrop-blur-md pointer-events-auto"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`relative w-full max-w-6xl aspect-video bg-black rounded-2xl shadow-2xl border border-white/10 overflow-hidden transition-all duration-500 pointer-events-auto flex flex-col ${isFullWidth ? 'max-w-none h-[95vh]' : ''}`}>

                {/* Header */}
                <div className="p-4 flex items-center justify-between bg-neutral-900 border-b border-white/5 z-20">
                    <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em]">Source selected</span>
                        <h3 className="text-white font-bold truncate text-sm sm:text-base">
                            {title} <span className="text-neutral-500 mx-1">/</span> <span className="text-purple-400">Ep {episode}</span>
                        </h3>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-3">
                        {/* Server Switcher */}
                        <button
                            onClick={switchServer}
                            className="flex items-center gap-2 px-3 py-1.5 bg-purple-600/10 hover:bg-purple-600/20 rounded-lg border border-purple-500/20 transition-all text-[10px] font-black text-purple-400 uppercase tracking-widest group"
                        >
                            <Server className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Server: {currentServer.name}</span>
                            <span className="sm:hidden">S{activeServer + 1}</span>
                            <ChevronRight className="w-3.5 h-3.5 opacity-50 group-hover:translate-x-0.5 transition-transform" />
                        </button>

                        <div className="w-px h-6 bg-white/10 hidden sm:block" />

                        <button
                            onClick={() => setIsFullWidth(!isFullWidth)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white hidden sm:block"
                        >
                            {isFullWidth ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-white/70 hover:text-red-400"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Player Area */}
                <div className="flex-1 bg-black relative group/player flex items-center justify-center">
                    {currentServer.type === 'embed' ? (
                        <iframe
                            key={playerUrl}
                            src={playerUrl}
                            className="w-full h-full border-0"
                            allowFullScreen
                            allow="autoplay; fullscreen"
                        />
                    ) : (
                        <div className="p-8 flex flex-col items-center text-center max-w-md">
                            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
                                <Search className="w-8 h-8 text-red-500" />
                            </div>
                            <h4 className="text-xl font-bold text-white mb-2">Watch on Muse Asia</h4>
                            <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
                                Muse Asia hosts legal anime on YouTube. Click the button below to search for this specific episode on their channel.
                            </p>
                            <a
                                href={playerUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-600 hover:bg-red-700 rounded-xl text-white font-bold transition-all transform hover:scale-[1.02] shadow-xl shadow-red-600/20"
                            >
                                <ExternalLink className="w-5 h-5" />
                                Launch YouTube Search
                            </a>
                            <button
                                onClick={switchServer}
                                className="mt-4 text-xs font-bold text-neutral-500 hover:text-white transition-colors"
                            >
                                Use an embedded server instead
                            </button>
                        </div>
                    )}

                    {/* Fallback Hint */}
                    {currentServer.type === 'embed' && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover/player:opacity-100 transition-opacity pointer-events-none">
                            <div className="px-4 py-2 bg-black/80 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold text-neutral-400 uppercase tracking-widest whitespace-nowrap">
                                Video not loading? Try <span className="text-purple-400">Switching Sources</span> above
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer / External Fallback */}
                <div className="p-3 bg-neutral-900/50 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-neutral-500">
                        <Search className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Can't find it here?</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href={`https://animepahe.ru/search?q=${encodeURIComponent(title || '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded text-[10px] font-bold text-neutral-300 transition-colors border border-white/5"
                        >
                            <ExternalLink className="w-3 h-3" />
                            Animepahe
                        </a>
                        <a
                            href={`https://gogoanime3.co/search.html?keyword=${encodeURIComponent(title || '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded text-[10px] font-bold text-neutral-300 transition-colors border border-white/5"
                        >
                            <ExternalLink className="w-3 h-3" />
                            GogoAnime
                        </a>
                        <a
                            href={googleSearchUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded text-[10px] font-bold text-neutral-300 transition-colors border border-white/5"
                        >
                            <ExternalLink className="w-3 h-3" />
                            Google
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
