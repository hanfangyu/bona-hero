'use client';

import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';
import ProgressBar from './ProgressBar';

gsap.registerPlugin(Observer);

const PRODUCTS = [
  { id: 'boka', title: '博卡', subtitle: 'VISUAL CREATION', color: 'from-[#f42919]/20' },
  { id: 'bole', title: '博乐', subtitle: 'VIDEO GENERATION', color: 'from-[#0496ff]/20' },
  { id: 'bowen', title: '博文', subtitle: 'SCRIPT WRITING', color: 'from-emerald-600/20' }
];

export default function HeroSection({ isLogged }: { isLogged: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  useGSAP(() => {
    if (isLogged || !containerRef.current) return;

    const observer = Observer.create({
      target: window,
      type: "wheel,touch,pointer",
      wheelSpeed: -1,
      onDown: () => handleScroll(1),
      onUp: () => handleScroll(-1),
      tolerance: 10,
      preventDefault: true
    });

    return () => observer.kill();
  }, [isLogged]);

  const handleScroll = (direction: number) => {
    if (isAnimating.current) return;
    
    const nextIndex = currentIndex + direction;
    if (nextIndex >= 0 && nextIndex < PRODUCTS.length) {
      isAnimating.current = true;
      setCurrentIndex(nextIndex);
      
      // Cinematic cut effect
      gsap.fromTo('.hero-text', 
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out', onComplete: () => {
          setTimeout(() => { isAnimating.current = false; }, 800); // Snappy debounce
        }}
      );
    }
  };

  const product = PRODUCTS[currentIndex];

  return (
    <div ref={containerRef} className="relative w-full h-[100vh] overflow-hidden">
      {/* Background Video Placeholder with gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${product.color} to-black transition-colors duration-1000 ease-in-out`} />
      <div className="absolute inset-0 bg-[#090909]/40" /> {/* Darken overlay */}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-12 lg:p-24 z-10 hero-text">
        <div className="max-w-[75vw]">
          <h1 className="text-6xl lg:text-[80px] font-bold font-display tracking-tight leading-[1.1] mb-2">
            {product.title}
          </h1>
          <p className="text-xl lg:text-3xl font-accent text-white/70 mb-12 italic">
            {product.subtitle}
          </p>
          <button className="btn-primary text-white font-semibold px-8 py-4 uppercase tracking-wider text-sm">
            立即体验
          </button>
        </div>
      </div>

      <ProgressBar currentIndex={currentIndex} total={PRODUCTS.length} />
    </div>
  );
}