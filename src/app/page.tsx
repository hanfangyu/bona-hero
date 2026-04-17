'use client';

import { useState } from 'react';
import CinematicLayout from '@/components/hero/CinematicLayout';
import HeroSection from '@/components/hero/HeroSection';

export default function Home() {
  const [isLogged, setIsLogged] = useState(false);

  return (
    <CinematicLayout>
      {/* Dev toggle purely for demonstrating the transition */}
      <button 
        onClick={() => setIsLogged(!isLogged)}
        className="fixed top-4 right-4 z-50 px-4 py-2 bg-white/10 border border-white/20 rounded text-xs uppercase hover:bg-white/20 transition-colors"
      >
        Toggle Login State
      </button>

      <HeroSection isLogged={isLogged} />
    </CinematicLayout>
  );
}