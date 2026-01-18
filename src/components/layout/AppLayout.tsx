import type { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface AppLayoutProps {
    children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="relative min-h-screen bg-[#0a0a0a]">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none fixed" />
            <Navbar />
            <main className="relative pt-20 pb-12 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
