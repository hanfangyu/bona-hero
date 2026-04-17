'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import ProjectCard from './ProjectCard';

const MOCK_PROJECTS = [
  { id: '1', title: 'Cyberpunk City', time: '2 hours ago', color: 'from-[#f42919]/40', height: '320px' },
  { id: '2', title: 'Neon Lights', time: 'Just now', color: 'from-[#f4824d]/40', height: '240px' },
  { id: '3', title: 'Space Odyssey', time: 'Yesterday', color: 'from-[#0496ff]/40', height: '420px' },
  { id: '4', title: 'Desert Dune', time: '3 days ago', color: 'from-orange-600/40', height: '280px' },
  { id: '5', title: 'Ocean Deep', time: '1 week ago', color: 'from-cyan-600/40', height: '380px' },
  { id: '6', title: 'Mountain Peak', time: '2 weeks ago', color: 'from-[#19191d]/60', height: '300px' },
];

export default function ProjectWaterfall({ isVisible }: { isVisible: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    if (isVisible) {
      gsap.fromTo(containerRef.current,
        { autoAlpha: 0, y: 100 },
        { autoAlpha: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.5 }
      );
    } else {
      gsap.set(containerRef.current, { autoAlpha: 0 });
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div ref={containerRef} className="w-full max-w-[90vw] mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl font-bold tracking-tight font-display">My Projects</h2>
        <div className="flex gap-8 text-base font-semibold tracking-wide text-white/40 glass-panel px-6 py-3 rounded-[10px]">
          <span className="text-white cursor-pointer">博卡</span>
          <span className="cursor-pointer hover:text-white/80 transition-colors">博乐</span>
          <span className="cursor-pointer hover:text-white/80 transition-colors">博文</span>
        </div>
      </div>
      
      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        {MOCK_PROJECTS.map(p => (
          <div key={p.id} className="break-inside-avoid">
             <ProjectCard project={p} />
          </div>
        ))}
      </div>
    </div>
  );
}