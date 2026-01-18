import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../hooks/useLibrary';
import { Navigate, Link } from 'react-router-dom';
import { LogOut, BarChart, Loader2 } from 'lucide-react';

export default function Profile() {
    const { user, signOut, isLoading: isAuthLoading } = useAuth();
    const { library, isLoading: isLibLoading } = useLibrary();

    if (isAuthLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    // Stats Calculations
    const totalMedia = library.length;
    const completed = library.filter(item => item.status === 'COMPLETED' || item.status === 'FINISHED').length;
    const totalChapters = library.reduce((acc, curr) => acc + (curr.progress_chapter || 0), 0);
    const totalEpisodes = library.reduce((acc, curr) => acc + (curr.progress_episode || 0), 0);

    // Sort by updated_at for recent activity
    const recentActivity = [...library]
        .sort((a, b) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime())
        .slice(0, 5);

    return (
        <div className="-mt-20">
            {/* Banner */}
            <div className="h-[30vh] w-full bg-gradient-to-r from-purple-900 to-blue-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                <div className="absolute inset-0 bg-black/20" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-20">
                <div className="flex flex-col md:flex-row gap-8 items-end">

                    {/* Avatar */}
                    <div className="relative">
                        <div className="h-40 w-40 rounded-full border-4 border-[#0a0a0a] bg-neutral-800 flex items-center justify-center overflow-hidden shadow-2xl">
                            <span className="text-4xl font-bold text-neutral-500">
                                {user.email?.[0].toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 pb-4">
                        <h1 className="text-3xl font-black text-white">{user.email?.split('@')[0]}</h1>
                        <p className="text-neutral-400">Library • Joined {new Date(user.created_at).toLocaleDateString()}</p>
                    </div>

                    {/* Actions */}
                    <div className="pb-4">
                        <button
                            onClick={() => signOut()}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 font-medium rounded-lg hover:bg-red-500/20 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Media', value: totalMedia, color: 'text-purple-400' },
                        { label: 'Completed', value: completed, color: 'text-green-400' },
                        { label: 'Chapters Read', value: totalChapters, color: 'text-blue-400' },
                        { label: 'Episodes Watched', value: totalEpisodes, color: 'text-yellow-400' }
                    ].map((stat) => (
                        <div key={stat.label} className="bg-neutral-900/50 border border-white/5 rounded-xl p-6 backdrop-blur-sm">
                            <div className="text-sm text-neutral-400 mb-1">{stat.label}</div>
                            <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* Recent Activity */}
                <h2 className="mt-16 text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <BarChart className="w-5 h-5" />
                    Recent Updates
                </h2>

                {recentActivity.length > 0 ? (
                    <div className="grid gap-3">
                        {recentActivity.map((item) => (
                            <Link
                                to={`/${item.media_type.toLowerCase()}/${item.media_id}`}
                                key={item.media_id}
                                className="flex items-center gap-4 bg-neutral-900/30 border border-white/5 rounded-xl p-4 hover:bg-white/5 transition-colors group"
                            >
                                <img src={item.cover_image} className="w-12 h-16 object-cover rounded-lg" alt="" />
                                <div className="flex-1">
                                    <h3 className="font-bold text-white group-hover:text-purple-400 transition-colors">{item.title}</h3>
                                    <div className="text-sm text-neutral-500">
                                        Updated {item.progress_chapter || item.progress_episode} {item.media_type === 'ANIME' ? 'episodes' : 'chapters'}
                                    </div>
                                </div>
                                <div className="text-xs text-neutral-600 font-mono">
                                    {new Date(item.updated_at || 0).toLocaleDateString()}
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="bg-neutral-900/30 border border-white/5 rounded-xl p-12 text-center text-neutral-500">
                        {isLibLoading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'No recent activity to show.'}
                    </div>
                )}

            </div>
        </div>
    );
}
