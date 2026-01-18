import { Link, useLocation } from 'react-router-dom';
import { Search, Library, Home, User } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext';

export function Navbar() {
    const location = useLocation();
    const { user } = useAuth();

    const navItems = [
        { label: 'Home', path: '/', icon: Home },
        { label: 'Library', path: '/library', icon: Library },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl transition-all">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">

                    {/* Logo */}
                    <div className="flex items-center gap-4">
                        <Link to="/" className="group flex items-center gap-2">
                            <span className="text-2xl font-black tracking-tighter text-white transition-colors group-hover:text-purple-400">
                                KOMA
                            </span>
                            <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-neutral-400">
                                Beta
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <div className="flex items-center gap-1 bg-white/5 rounded-full px-2 py-1 border border-white/5">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={clsx(
                                            'flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all',
                                            isActive
                                                ? 'bg-neutral-800 text-white shadow-sm'
                                                : 'text-neutral-400 hover:text-white hover:bg-white/5'
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Search / Profile */}
                    <div className="flex items-center gap-4">
                        <Link to="/search" className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white">
                            <Search className="h-5 w-5" />
                        </Link>

                        {user ? (
                            <Link to="/profile" className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 overflow-hidden border border-white/20 hover:opacity-80 transition-opacity flex items-center justify-center">
                                <span className="text-sm font-bold text-white">{user.email?.[0].toUpperCase()}</span>
                            </Link>
                        ) : (
                            <Link to="/login" className="flex items-center gap-2 px-4 py-1.5 text-sm font-bold text-white bg-white/10 rounded-full hover:bg-white/20 transition-all border border-white/5">
                                <User className="w-4 h-4" />
                                Sign In
                            </Link>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
}
