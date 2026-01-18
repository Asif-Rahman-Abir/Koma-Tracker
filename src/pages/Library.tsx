import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { useLibrary } from '../hooks/useLibrary';
import clsx from 'clsx';
import { BookOpen, CheckCircle, Clock, Loader2 } from 'lucide-react';

type LibraryStatus = 'READING' | 'COMPLETED' | 'PLAN_TO_READ';

export default function Library() {
    const [activeStatus, setActiveStatus] = useState<LibraryStatus>('READING');
    const { library, isLoading } = useLibrary();

    const filteredItems = library.filter(item => item.status === activeStatus);

    const tabs: { id: LibraryStatus; label: string; icon: any }[] = [
        { id: 'READING', label: 'Reading / Watching', icon: Clock },
        { id: 'COMPLETED', label: 'Completed', icon: CheckCircle },
        { id: 'PLAN_TO_READ', label: 'Plan to Read', icon: BookOpen },
    ];

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
            </div>
        );
    }

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
                            id={item.media_id}
                            type={item.media_type.toLowerCase()}
                            image={item.cover_image}
                            title={item.title}
                            country={item.media_type === 'MANHWA' ? 'KR' : item.media_type === 'MANHUA' ? 'CN' : 'JP'}
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
