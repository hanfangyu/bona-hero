'use client';

import { useEffect, useState, useRef } from 'react';
import CinematicCanvas from './CinematicCanvas';
import ProgressIndicator from './ProgressIndicator';

const PRODUCTS = [
  {
    id: 'boka',
    title: '博卡',
    subtitle: 'VISUAL CREATION',
    description: 'AI驱动的图像与视频创作平台，让灵感瞬间绽放',
    accentColor: '#f42919',
    gradientStart: 'rgba(244, 41, 25, 0.15)',
  },
  {
    id: 'bole',
    title: '博乐',
    subtitle: 'VIDEO GENERATION',
    description: '一键生成专业级视频，从创意到成片只需秒级',
    accentColor: '#0496ff',
    gradientStart: 'rgba(4, 150, 255, 0.15)',
  },
  {
    id: 'bowen',
    title: '博文',
    subtitle: 'SCRIPT WRITING',
    description: '智能剧本创作助手，从构思到落笔一气呵成',
    accentColor: '#10b981',
    gradientStart: 'rgba(16, 185, 129, 0.15)',
  },
];

const SCROLL_THRESHOLDS = {
  product1Start: 0.0,
  product1End: 0.33,
  product2Start: 0.33,
  product2End: 0.66,
  product3Start: 0.66,
  product3End: 1.0,
};

function calculateProductState(
  scrollProgress: number,
  fadeInStart: number,
  fadeInEnd: number,
  fadeOutStart: number,
  fadeOutEnd: number
) {
  if (scrollProgress < fadeInStart) {
    return { opacity: 0, translateY: 40, scale: 0.9 };
  }

  if (scrollProgress < fadeInEnd) {
    const progress = (scrollProgress - fadeInStart) / (fadeInEnd - fadeInStart);
    return {
      opacity: progress,
      translateY: 40 - 40 * progress,
      scale: 0.9 + 0.1 * progress,
    };
  }

  if (scrollProgress < fadeOutStart) {
    return { opacity: 1, translateY: 0, scale: 1 };
  }

  if (scrollProgress < fadeOutEnd) {
    const progress = (scrollProgress - fadeOutStart) / (fadeOutEnd - fadeOutStart);
    return {
      opacity: 1 - progress,
      translateY: -40 * progress,
      scale: 1 - 0.1 * progress,
    };
  }

  return { opacity: 0, translateY: -40, scale: 0.9 };
}

export default function HeroSequence({ isLogged }: { isLogged: boolean }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLogged || !containerRef.current) return;

    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const containerHeight = container.offsetHeight;
      const viewportHeight = window.innerHeight;

      const scrollableDistance = containerHeight - viewportHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLogged]);

  const product1State = calculateProductState(
    scrollProgress,
    SCROLL_THRESHOLDS.product1Start,
    SCROLL_THRESHOLDS.product1Start + 0.1,
    SCROLL_THRESHOLDS.product1End - 0.1,
    SCROLL_THRESHOLDS.product1End
  );

  const product2State = calculateProductState(
    scrollProgress,
    SCROLL_THRESHOLDS.product2Start,
    SCROLL_THRESHOLDS.product2Start + 0.1,
    SCROLL_THRESHOLDS.product2End - 0.1,
    SCROLL_THRESHOLDS.product2End
  );

  const product3State = calculateProductState(
    scrollProgress,
    SCROLL_THRESHOLDS.product3Start,
    SCROLL_THRESHOLDS.product3Start + 0.1,
    SCROLL_THRESHOLDS.product3End - 0.1,
    SCROLL_THRESHOLDS.product3End
  );

  return (
    <div ref={containerRef} className="relative h-[400vh]" data-hero-sequence>
      <div className="sticky top-0 flex flex-col w-screen h-screen items-center">
        
        <CinematicCanvas 
          scrollProgress={scrollProgress} 
          products={PRODUCTS}
          isLogged={isLogged}
        />

        <ProgressIndicator 
          progress={scrollProgress} 
          products={PRODUCTS}
          isLogged={isLogged}
        />

        <div className={`absolute inset-0 flex flex-col items-center justify-center px-8 lg:px-16 z-30 transition-opacity duration-500 ${isLogged ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          
          <div
            className="product-overlay absolute inset-0 flex flex-col items-center justify-center px-8 lg:px-16"
            style={{
              opacity: product1State.opacity,
              transform: `translateY(${product1State.translateY}px) scale(${product1State.scale})`,
              pointerEvents: product1State.opacity > 0.01 ? 'auto' : 'none',
            }}
          >
            <div className="text-center max-w-[32rem] lg:max-w-[48rem]">
              <h1 className="text-5xl sm:text-7xl lg:text-[90px] font-bold font-display tracking-tight leading-[1.05] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                {PRODUCTS[0].title}
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl font-accent italic mb-6 text-white/70" style={{ fontFamily: 'var(--font-accent)' }}>
                {PRODUCTS[0].subtitle}
              </p>
              <p className="text-lg lg:text-xl text-white/60 max-w-[28rem] mx-auto mb-10 leading-relaxed">
                {PRODUCTS[0].description}
              </p>
              <button className="btn-primary text-white font-semibold px-10 py-5 uppercase tracking-wider text-base">
                立即体验
              </button>
            </div>
          </div>

          <div
            className="product-overlay absolute inset-0 flex flex-col items-center justify-center px-8 lg:px-16"
            style={{
              opacity: product2State.opacity,
              transform: `translateY(${product2State.translateY}px) scale(${product2State.scale})`,
              pointerEvents: product2State.opacity > 0.01 ? 'auto' : 'none',
            }}
          >
            <div className="text-center max-w-[32rem] lg:max-w-[48rem]">
              <h1 className="text-5xl sm:text-7xl lg:text-[90px] font-bold font-display tracking-tight leading-[1.05] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                {PRODUCTS[1].title}
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl font-accent italic mb-6 text-white/70" style={{ fontFamily: 'var(--font-accent)' }}>
                {PRODUCTS[1].subtitle}
              </p>
              <p className="text-lg lg:text-xl text-white/60 max-w-[28rem] mx-auto mb-10 leading-relaxed">
                {PRODUCTS[1].description}
              </p>
              <button className="btn-primary text-white font-semibold px-10 py-5 uppercase tracking-wider text-base">
                立即体验
              </button>
            </div>
          </div>

          <div
            className="product-overlay absolute inset-0 flex flex-col items-center justify-center px-8 lg:px-16"
            style={{
              opacity: product3State.opacity,
              transform: `translateY(${product3State.translateY}px) scale(${product3State.scale})`,
              pointerEvents: product3State.opacity > 0.01 ? 'auto' : 'none',
            }}
          >
            <div className="text-center max-w-[32rem] lg:max-w-[48rem]">
              <h1 className="text-5xl sm:text-7xl lg:text-[90px] font-bold font-display tracking-tight leading-[1.05] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                {PRODUCTS[2].title}
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl font-accent italic mb-6 text-white/70" style={{ fontFamily: 'var(--font-accent)' }}>
                {PRODUCTS[2].subtitle}
              </p>
              <p className="text-lg lg:text-xl text-white/60 max-w-[28rem] mx-auto mb-10 leading-relaxed">
                {PRODUCTS[2].description}
              </p>
              <button className="btn-primary text-white font-semibold px-10 py-5 uppercase tracking-wider text-base">
                立即体验
              </button>
            </div>
          </div>

          <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-40 text-white/70 transition-opacity duration-500 ${scrollProgress > 0.05 ? 'opacity-0' : 'opacity-100'}`}>
            <span className="text-sm tracking-widest uppercase">Scroll to explore</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-bounce">
              <path d="M12 5v14M19 12l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}