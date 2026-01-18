import { X, Maximize2, Minimize2 } from 'lucide-react';
import { useState } from 'react';

interface PlayerModalProps {
    anilistId: number;
    episode: number;
    onClose: () => void;
    title?: string;
}

export function PlayerModal({ anilistId, episode, onClose, title }: PlayerModalProps) {
    const [isFullWidth, setIsFullWidth] = useState(false);

    // Using vidplus as the primary provider
    const playerUrl = `https://player.vidplus.to/embed/anime/${anilistId}/${episode}?dub=false&autoplay=true`;

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
                <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent z-10 opacity-0 hover:opacity-100 transition-opacity">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Watching</span>
                        <h3 className="text-white font-bold truncate max-w-[200px] sm:max-w-md">
                            {title} - Episode {episode}
                        </h3>
                    </div>

                    <div className="flex items-center gap-2">
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
                    className="w-full h-full border-0"
                    allowFullScreen
                    allow="autoplay; fullscreen"
                />
            </div>
        </div>
    );
}
