import { X, Maximize2, Minimize2, Server, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface PlayerModalProps {
    anilistId: number;
    episode: number;
    onClose: () => void;
    title?: string;
}

const SERVERS = [
    { id: 'vidplus', name: 'VidPlus (Premium)', url: (id: number, ep: number) => `https://player.vidplus.to/embed/anime/${id}/${ep}?dub=false&autoplay=true` },
    { id: 'anilistplayer', name: 'AnilistPlayer (Stable)', url: (id: number, ep: number) => `https://anilistplayer.com/player/index.php?id=${id}&ep=${ep}` },
    { id: 'vidsrc', name: 'VidSrc (Secondary)', url: (id: number, ep: number) => `https://vidsrc.to/embed/anime/${id}/${ep}` },
];

export function PlayerModal({ anilistId, episode, onClose, title }: PlayerModalProps) {
    const [isFullWidth, setIsFullWidth] = useState(false);
    const [activeServer, setActiveServer] = useState(0);

    const currentServer = SERVERS[activeServer];
    const playerUrl = currentServer.url(anilistId, episode);

    const switchServer = () => {
        setActiveServer((prev) => (prev + 1) % SERVERS.length);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-none">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/90 backdrop-blur-sm pointer-events-auto"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`relative w-full max-w-6xl aspect-video bg-black rounded-2xl shadow-2xl border border-white/10 overflow-hidden transition-all duration-300 pointer-events-auto ${isFullWidth ? 'max-w-none h-[90vh]' : ''}`}>
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/90 to-transparent z-20 transition-opacity">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Watching</span>
                        <h3 className="text-white font-bold truncate max-w-[150px] sm:max-w-md">
                            {title} - Ep {episode}
                        </h3>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-3">
                        {/* Server Switcher */}
                        <button
                            onClick={switchServer}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full border border-white/10 transition-all text-xs font-bold text-white group"
                            title="Switch Server"
                        >
                            <Server className="w-3.5 h-3.5 text-purple-400" />
                            <span className="hidden sm:inline">Source: {currentServer.name}</span>
                            <span className="sm:hidden">S{activeServer + 1}</span>
                            <ChevronRight className="w-3.5 h-3.5 opacity-50 group-hover:translate-x-0.5 transition-transform" />
                        </button>

                        <div className="w-px h-6 bg-white/10 hidden sm:block" />

                        <button
                            onClick={() => setIsFullWidth(!isFullWidth)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
                            title={isFullWidth ? "Exit focus mode" : "Focus mode"}
                        >
                            {isFullWidth ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-red-500/20 rounded-full transition-colors text-white/70 hover:text-red-400"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Player Iframe */}
                <iframe
                    src={playerUrl}
                    className="w-full h-full border-0 rounded-2xl"
                    allowFullScreen
                    allow="autoplay; fullscreen"
                />
            </div>
        </div>
    );
}
