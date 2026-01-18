import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { LogOut, Settings, BarChart } from 'lucide-react';

export default function Profile() {
    const { user, signOut, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

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
                        <button className="absolute bottom-2 right-2 p-2 bg-neutral-900 rounded-full border border-white/10 hover:bg-neutral-800 transition-colors">
                            <Settings className="w-5 h-5 text-white" />
                        </button>
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
                        { label: 'Total Read', value: '0', color: 'text-purple-400' },
                        { label: 'Chapters', value: '0', color: 'text-blue-400' },
                        { label: 'Mean Score', value: '-', color: 'text-yellow-400' },
                        { label: 'Days Read', value: '0.0', color: 'text-green-400' }
                    ].map((stat) => (
                        <div key={stat.label} className="bg-neutral-900/50 border border-white/5 rounded-xl p-6 backdrop-blur-sm">
                            <div className="text-sm text-neutral-400 mb-1">{stat.label}</div>
                            <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* Recent Activity Placeholder */}
                <h2 className="mt-16 text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <BarChart className="w-5 h-5" />
                    Recent Activity
                </h2>
                <div className="bg-neutral-900/30 border border-white/5 rounded-xl p-12 text-center text-neutral-500">
                    No recent activity to show.
                </div>

            </div>
        </div>
    );
}
