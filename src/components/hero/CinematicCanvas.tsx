'use client';

import { useRef, useEffect, useCallback } from 'react';

interface Product {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  accentColor: string;
  gradientStart: string;
}

interface CinematicCanvasProps {
  scrollProgress: number;
  products: Product[];
  isLogged: boolean;
}

export default function CinematicCanvas({ scrollProgress, products, isLogged }: CinematicCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    color: string;
    life: number;
  }>>([]);

  const initParticles = useCallback((width: number, height: number, color: string) => {
    const particles: typeof particlesRef.current = [];
    const particleCount = Math.floor((width * height) / 8000);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8 + 0.2,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        color,
        life: Math.random() * 100 + 100,
      });
    }

    particlesRef.current = particles;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    ctx.clearRect(0, 0, width, height);

    const currentProductIndex = Math.floor(scrollProgress * products.length);
    const safeIndex = Math.min(currentProductIndex, products.length - 1);
    const product = products[safeIndex];

    const baseGradient = ctx.createRadialGradient(
      width * 0.3, height * 0.3, 0,
      width * 0.5, height * 0.5, width * 0.8
    );

    const accentColor = product.accentColor;
    baseGradient.addColorStop(0, accentColor + '25');
    baseGradient.addColorStop(0.4, '#090909');
    baseGradient.addColorStop(1, '#000000');

    ctx.fillStyle = baseGradient;
    ctx.fillRect(0, 0, width, height);

    const waveGradient = ctx.createLinearGradient(0, height, width, 0);
    waveGradient.addColorStop(0, 'rgba(244, 130, 77, 0.08)');
    waveGradient.addColorStop(scrollProgress, accentColor + '15');
    waveGradient.addColorStop(1, 'rgba(4, 150, 255, 0.08)');

    ctx.fillStyle = waveGradient;
    ctx.fillRect(0, 0, width, height);

    const flowY = (scrollProgress * height * 0.5) % height;
    const flowGradient = ctx.createLinearGradient(0, flowY - 200, 0, flowY + 200);
    flowGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    flowGradient.addColorStop(0.5, accentColor + '08');
    flowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = flowGradient;
    ctx.fillRect(0, flowY - 200, width, 400);

    const hexColor = accentColor.replace('#', '');
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);

    initParticles(width, height, accentColor);

    const particles = particlesRef.current;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.5;

      if (p.life <= 0 || p.y > height + 50) {
        p.x = Math.random() * width;
        p.y = Math.random() * height * 0.2 - 50;
        p.life = Math.random() * 100 + 100;
        p.opacity = Math.random() * 0.5 + 0.1;
      }

      const lifeRatio = p.life / 200;
      const alpha = p.opacity * lifeRatio;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.fill();

      if (alpha > 0.3) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.2})`;
        ctx.fill();
      }
    }

    const beamCount = 3;
    for (let i = 0; i < beamCount; i++) {
      const beamProgress = (scrollProgress + i * 0.3) % 1;
      const beamY = beamProgress * height;
      const beamWidth = 2 + Math.sin(beamProgress * Math.PI * 2) * 1;

      const beamGradient = ctx.createLinearGradient(0, beamY - 100, 0, beamY + 100);
      beamGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      beamGradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.15)`);
      beamGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = beamGradient;
      ctx.fillRect(width * (0.3 + i * 0.2), beamY - 100, beamWidth, 200);
    }

    const centerX = width * 0.5;
    const centerY = height * 0.4;
    const maxRadius = Math.min(width, height) * 0.35;
    const pulseRadius = maxRadius * (0.8 + Math.sin(scrollProgress * Math.PI * 4) * 0.2);

    const pulseGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseRadius);
    pulseGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.08)`);
    pulseGradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.03)`);
    pulseGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = pulseGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
    ctx.fill();

    const vignetteGradient = ctx.createRadialGradient(
      width * 0.5, height * 0.5, height * 0.2,
      width * 0.5, height * 0.5, width * 0.8
    );
    vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignetteGradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');

    ctx.fillStyle = vignetteGradient;
    ctx.fillRect(0, 0, width, height);

    const zoomFactor = 1 + scrollProgress * 0.03;
    ctx.setTransform(zoomFactor, 0, 0, zoomFactor, -(zoomFactor - 1) * width / 2, -(zoomFactor - 1) * height / 2);

  }, [scrollProgress, products, initParticles]);

  useEffect(() => {
    const animate = () => {
      draw();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [draw]);

  useEffect(() => {
    const handleResize = () => {
      draw();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  if (isLogged) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 w-full h-full"
      style={{ background: '#090909' }}
    />
  );
}