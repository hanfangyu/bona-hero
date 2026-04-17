'use client';

import { ReactNode } from 'react';

export default function CinematicLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen w-full bg-[#090909] selection:bg-orange-500/30">
      <div className="noise-overlay" />
      
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-gradient-radial from-orange-500/20 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-radial from-purple-500/10 via-transparent to-transparent blur-2xl" />
      </div>
      
      <div className="relative z-10">
        {children}
      </div>
    </main>
  );
}