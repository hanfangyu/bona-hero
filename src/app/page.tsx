'use client';

import { useState } from 'react';
import CinematicLayout from '@/components/hero/CinematicLayout';
import HeroSequence from '@/components/hero/HeroSequence';
import ProjectWaterfall from '@/components/workspace/ProjectWaterfall';

export default function Home() {
  const [isLogged, setIsLogged] = useState(false);

  return (
    <CinematicLayout>
      <button 
        onClick={() => setIsLogged(!isLogged)}
        className="fixed top-6 right-6 z-50 px-6 py-3 glass-panel text-sm font-semibold tracking-wide hover:bg-white/5 transition-all text-white rounded-[10px]"
      >
        {isLogged ? 'Sign Out' : 'Sign In'}
      </button>

      <div className="flex flex-col w-full min-h-screen relative">
         <HeroSequence isLogged={isLogged} />
         <ProjectWaterfall isVisible={isLogged} />
      </div>
    </CinematicLayout>
  );
}