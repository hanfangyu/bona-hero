# bona-hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a cinematic, high-end landing page for bona-hero featuring scroll-hijacked transitions and state-morphing animations. The design style should reference https://poly.app/ (glassmorphism, high contrast typography, dark cinematic background, orange gradient accents).

**Architecture:** Next.js app router with TailwindCSS for styling and GSAP (ScrollTrigger & Observer) for complex scroll-linked and timeline animations. The page has two primary states: Unlogged (Hero) and Logged-in (Workspace).

**Tech Stack:** Next.js (React), TailwindCSS, GSAP, Lucide React (for icons)

---

### Task 1: Setup GSAP and Base Layout Structure

**Files:**
- Create: `src/components/hero/CinematicLayout.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Install dependencies**
```bash
npm install gsap @gsap/react lucide-react
```

- [ ] **Step 2: Add global CSS variables for cinematic effects**
Add to `src/app/globals.css`:
```css
:root {
  --movie-black: #090909;
  --movie-surface: #19191d;
  --accent-orange-start: #f4824d;
  --accent-orange-end: #f42919;
}

body {
  background-color: var(--movie-black);
  color: white;
  overflow-x: hidden;
  font-family: var(--font-inter), sans-serif;
  letter-spacing: -0.02em;
}

.font-display {
  font-family: var(--font-haffer), sans-serif;
  letter-spacing: -0.02em;
}

.font-accent {
  font-family: var(--font-bogue), serif;
  letter-spacing: -0.03em;
}

.noise-overlay {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  pointer-events: none;
  z-index: 50;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

.glass-panel {
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  background: linear-gradient(100.81deg, rgba(41, 41, 48, 0.2) 7.89%, rgba(25, 25, 29, 0.2) 91.16%);
  border: 1px solid hsla(0, 0%, 96%, 0.3);
  box-shadow: 
    4px 5px 20px rgba(0, 0, 0, 0.4),
    inset -1px -1px 4px rgba(0, 0, 0, 0.15),
    inset 1px 1px 4px rgba(255, 255, 255, 0.15);
}

.btn-primary {
  background: linear-gradient(134.77deg, var(--accent-orange-start) 25.1%, var(--accent-orange-end) 74.9%);
  transition: box-shadow 0.3s;
  border-radius: 0.625rem;
}

.btn-primary:hover {
  box-shadow: 
    4px 4px 10px rgba(0, 0, 0, 0.4),
    inset -2px -2px 4px rgba(0, 0, 0, 0.15),
    inset 2px 2px 4px rgba(255, 255, 255, 0.15);
}
```

- [ ] **Step 3: Create base layout component**
```tsx
// src/components/hero/CinematicLayout.tsx
'use client';

import { ReactNode } from 'react';

export default function CinematicLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen w-full bg-[#090909] selection:bg-orange-500/30 font-sans">
      <div className="noise-overlay" />
      {children}
    </main>
  );
}
```

- [ ] **Step 4: Update page.tsx**
```tsx
// src/app/page.tsx
import CinematicLayout from '@/components/hero/CinematicLayout';

export default function Home() {
  return (
    <CinematicLayout>
      <div className="h-screen w-full flex items-center justify-center">
        <h1 className="text-4xl font-display font-bold tracking-tight">BONA CREATE.</h1>
      </div>
    </CinematicLayout>
  );
}
```

- [ ] **Step 5: Commit**
```bash
git add package.json src/app/globals.css src/components/hero/CinematicLayout.tsx src/app/page.tsx
git commit -m "feat: setup GSAP dependencies and base cinematic layout"
```

---

### Task 2: Build Unlogged State (Immersive Hero & Scroll Hijack)

**Files:**
- Create: `src/components/hero/HeroSection.tsx`
- Create: `src/components/hero/ProgressBar.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create Progress Bar component**
```tsx
// src/components/hero/ProgressBar.tsx
'use client';

interface ProgressBarProps {
  currentIndex: number;
  total: number;
}

export default function ProgressBar({ currentIndex, total }: ProgressBarProps) {
  return (
    <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20 glass-panel p-4 rounded-full">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center justify-center gap-4 relative">
          <span className={`absolute right-6 text-xs tracking-widest font-mono transition-all duration-500 ${i === currentIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}`}>
            0{i + 1}
          </span>
          <div 
            className={`w-[4px] rounded-full transition-all duration-500 ${
              i === currentIndex ? 'h-12 bg-white' : 'h-4 bg-white/20'
            }`}
          />
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create Hero Section with Scroll Hijack**
```tsx
// src/components/hero/HeroSection.tsx
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
```

- [ ] **Step 3: Update page.tsx to use HeroSection**
```tsx
// src/app/page.tsx
import CinematicLayout from '@/components/hero/CinematicLayout';
import HeroSection from '@/components/hero/HeroSection';

export default function Home() {
  // Mock login state for now
  const isLogged = false;

  return (
    <CinematicLayout>
      <HeroSection isLogged={isLogged} />
    </CinematicLayout>
  );
}
```

- [ ] **Step 4: Commit**
```bash
git add src/components/hero/ProgressBar.tsx src/components/hero/HeroSection.tsx src/app/page.tsx
git commit -m "feat: implement unlogged hero state with scroll hijack"
```

---

### Task 3: Build State Morphing Transition (Cinematic Letterboxing)

**Files:**
- Modify: `src/components/hero/HeroSection.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add Morphing Animation logic**
Update `HeroSection.tsx` to handle the `isLogged` prop change:
```tsx
// In src/components/hero/HeroSection.tsx, update the component:
// (Add this useGSAP block below the existing one)

  useGSAP(() => {
    if (!containerRef.current) return;

    if (isLogged) {
      // Cinematic Letterboxing effect
      const tl = gsap.timeline();
      
      tl.to(containerRef.current, {
        height: '40vh',
        duration: 1.5,
        ease: 'power4.inOut',
      })
      .to('.hero-text', {
        y: -50,
        scale: 0.8,
        transformOrigin: 'left bottom',
        duration: 1.5,
        ease: 'power4.inOut',
      }, '<')
      .to('.hero-text button', {
        opacity: 0,
        display: 'none',
        duration: 0.5
      }, '<');
    } else {
       // Reset if logged out
       gsap.to(containerRef.current, { height: '100vh', duration: 1, ease: 'power3.out' });
       gsap.to('.hero-text', { y: 0, scale: 1, duration: 1 });
       gsap.to('.hero-text button', { opacity: 1, display: 'block', duration: 0.5 });
    }
  }, [isLogged]);
```

- [ ] **Step 2: Add Login Toggle to page.tsx for testing**
```tsx
// src/app/page.tsx
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
```

- [ ] **Step 3: Commit**
```bash
git add src/components/hero/HeroSection.tsx src/app/page.tsx
git commit -m "feat: add cinematic letterboxing state morphing animation"
```

---

### Task 4: Build Project Library Waterfall (Hover Film Strips)

**Files:**
- Create: `src/components/workspace/ProjectWaterfall.tsx`
- Create: `src/components/workspace/ProjectCard.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create Project Card component**
```tsx
// src/components/workspace/ProjectCard.tsx
'use client';

interface Project {
  id: string;
  title: string;
  time: string;
  color: string;
  height: string;
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group relative w-full mb-6 cursor-pointer">
      <div className="relative w-full rounded-[10px] overflow-hidden transition-all duration-300 ease-in-out group-hover:-translate-y-1 group-hover:z-10 glass-panel" style={{ height: project.height }}>
        
        {/* Background placeholder with image overlay capability */}
        <div className={`absolute inset-0 bg-gradient-to-b ${project.color} to-[#19191d] opacity-80`} />
        
        {/* Vignette (暗角) */}
        <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] group-hover:shadow-[inset_0_0_20px_rgba(0,0,0,0.4)] transition-shadow duration-500" />
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-black/90 via-black/40 to-transparent translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-semibold text-lg tracking-tight mb-1">{project.title}</h3>
          <p className="text-white/60 text-sm font-medium">{project.time}</p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create Waterfall Layout component**
```tsx
// src/components/workspace/ProjectWaterfall.tsx
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
        { autoAlpha: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.5 } // Delay to let morphing finish
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
      
      {/* CSS columns for masonry/waterfall effect with poly.app gap style */}
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
```

- [ ] **Step 3: Update page.tsx to include Waterfall**
```tsx
// src/app/page.tsx
'use client';

import { useState } from 'react';
import CinematicLayout from '@/components/hero/CinematicLayout';
import HeroSection from '@/components/hero/HeroSection';
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
         <HeroSection isLogged={isLogged} />
         <ProjectWaterfall isVisible={isLogged} />
      </div>
    </CinematicLayout>
  );
}
```

- [ ] **Step 4: Commit**
```bash
git add src/components/workspace/ProjectCard.tsx src/components/workspace/ProjectWaterfall.tsx src/app/page.tsx
git commit -m "feat: add project library waterfall layout with hover film strip effect"
```

