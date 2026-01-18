import { useState } from 'react';
import { Card } from '../components/ui/Card';
import clsx from 'clsx';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';

type LibraryStatus = 'READING' | 'COMPLETED' | 'PLAN_TO_READ';

// Mock Data for now
const MOCK_LIBRARY = [
    {
        id: 1,
        title: { userPreferred: 'Solo Leveling' },
        coverImage: { large: 'https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/bx105398-b673VN5ZJLk8.jpg' },
        type: 'MANHWA',
        status: 'READING',
        progress: 150,
        total: 179,
        format: 'MANHWA'
    },
    {
        id: 2,
        title: { userPreferred: 'One Piece' },
        coverImage: { large: 'https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/bx30013-o07E8iP2qg5N.jpg' },
        type: 'MANGA',
        status: 'READING',
        progress: 1050,
        total: null,
        format: 'MANGA'
    },
    {
        id: 3,
        title: { userPreferred: 'Jujutsu Kaisen' },
        coverImage: { large: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx113415-bbBWj4pEfseh.jpg' },
        type: 'ANIME',
        status: 'COMPLETED',
        progress: 24,
        total: 24,
        format: 'TV'
    },
];

export default function Library() {
    const [activeStatus, setActiveStatus] = useState<LibraryStatus>('READING');

    const filteredItems = MOCK_LIBRARY.filter(item => item.status === activeStatus);

    const tabs: { id: LibraryStatus; label: string; icon: any }[] = [
        { id: 'READING', label: 'Reading / Watching', icon: Clock },
        { id: 'COMPLETED', label: 'Completed', icon: CheckCircle },
        { id: 'PLAN_TO_READ', label: 'Plan to Read', icon: BookOpen },
    ];

    return (
        <div className="min-h-screen px-4 py-8">
            <div className="mx-auto max-w-7xl">
                <h1 className="text-3xl font-bold text-white mb-8">Your Library</h1>

                {/* Status Tabs */}
                <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveStatus(tab.id)}
                                className={clsx(
                                    'flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap',
                                    activeStatus === tab.id
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20'
                                        : 'bg-neutral-900/50 text-neutral-400 hover:bg-neutral-800 hover:text-white'
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {filteredItems.map((item) => (
                        <Card
                            key={item.id}
                            id={item.id}
                            type={item.type.toLowerCase()}
                            image={item.coverImage.large}
                            title={item.title.userPreferred}
                            rating={85} // Mock score
                            country={item.format === 'MANHWA' ? 'KR' : item.format === 'MANHUA' ? 'CN' : 'JP'} // Mock country
                        />
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
                        <BookOpen className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg">No items in this list yet.</p>
                        <button className="mt-4 text-purple-400 hover:text-purple-300 font-bold">
                            Discover something new
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
