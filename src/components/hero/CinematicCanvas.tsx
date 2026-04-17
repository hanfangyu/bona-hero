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
  const timeRef = useRef(0);

  const parseColor = (hex: string) => {
    const h = hex.replace('#', '');
    return {
      r: parseInt(h.substring(0, 2), 16),
      g: parseInt(h.substring(2, 4), 16),
      b: parseInt(h.substring(4, 6), 16),
    };
  };

  const drawBokaScene = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number,
    color: { r: number; g: number; b: number }
  ) => {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.3)`);
    gradient.addColorStop(0.3, '#0a0a0a');
    gradient.addColorStop(1, '#000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const lightX = width * 0.15;
    const lightY = height * 0.3;
    const lightRadius = width * 0.4;
    const lightGradient = ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, lightRadius);
    lightGradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.25)`);
    lightGradient.addColorStop(0.3, `rgba(${color.r}, ${color.g}, ${color.b}, 0.08)`);
    lightGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = lightGradient;
    ctx.fillRect(0, 0, width, height);

    const filmStripY = (time * 0.02) % height;
    for (let i = 0; i < 12; i++) {
      const y = filmStripY - i * 80;
      if (y > -80 && y < height + 80) {
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${0.08 - i * 0.005})`;
        ctx.fillRect(0, y, width, 2);
        ctx.fillStyle = `rgba(0, 0, 0, 0.4)`;
        ctx.fillRect(0, y - 20, width, 20);
        ctx.fillRect(0, y + 2, width, 20);
      }
    }

    const flareCount = 5;
    for (let i = 0; i < flareCount; i++) {
      const flareProgress = (i * 0.15 + time * 0.001) % 1;
      const flareX = lightX + flareProgress * width * 0.7;
      const flareY = lightY + Math.sin(flareProgress * Math.PI) * height * 0.2;
      const flareWidth = width * 0.15;
      const flareHeight = height * 0.03 + i * 2;
      
      ctx.save();
      ctx.globalAlpha = 0.15 - i * 0.02;
      ctx.fillStyle = `rgba(${color.r + 50}, ${color.g + 30}, ${color.b}, 1)`;
      ctx.beginPath();
      ctx.ellipse(flareX, flareY, flareWidth, flareHeight, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    const vignette = ctx.createRadialGradient(
      width * 0.5, height * 0.5, height * 0.3,
      width * 0.5, height * 0.5, width * 0.7
    );
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  }, []);

  const drawBoleScene = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number,
    color: { r: number; g: number; b: number }
  ) => {
    const gradient = ctx.createRadialGradient(
      width * 0.7, height * 0.4, 0,
      width * 0.5, height * 0.5, width
    );
    gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.25)`);
    gradient.addColorStop(0.3, '#0a0a0a');
    gradient.addColorStop(1, '#000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const scanlineOffset = time * 0.5;
    for (let y = 0; y < height; y += 3) {
      const alpha = 0.02 + Math.sin((y + scanlineOffset) * 0.01) * 0.01;
      ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
      ctx.fillRect(0, y, width, 1);
    }

    const waveCount = 8;
    for (let i = 0; i < waveCount; i++) {
      const waveY = height * 0.3 + i * height * 0.08;
      const waveOffset = time * 0.01 + i * 50;
      
      ctx.beginPath();
      ctx.moveTo(0, waveY);
      for (let x = 0; x < width; x += 10) {
        const y = waveY + Math.sin((x + waveOffset) * 0.02) * 20 * (1 - i / waveCount);
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${0.15 - i * 0.015})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    const frameWidth = width * 0.6;
    const frameHeight = height * 0.7;
    const frameX = (width - frameWidth) / 2;
    const frameY = (height - frameHeight) / 2;
    
    ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.2)`;
    ctx.lineWidth = 1;
    ctx.strokeRect(frameX, frameY, frameWidth, frameHeight);
    
    ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.05)`;
    ctx.fillRect(frameX + 10, frameY + 10, frameWidth - 20, frameHeight - 20);

    const centerX = width * 0.5;
    const centerY = height * 0.5;
    const rings = 6;
    for (let i = 0; i < rings; i++) {
      const radius = (i + 1) * 80 + Math.sin(time * 0.02 + i) * 20;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${0.1 - i * 0.015})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    const vignette = ctx.createRadialGradient(
      width * 0.5, height * 0.5, height * 0.3,
      width * 0.5, height * 0.5, width * 0.7
    );
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  }, []);

  const drawBowenScene = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number,
    color: { r: number; g: number; b: number }
  ) => {
    const gradient = ctx.createLinearGradient(0, 0, width * 0.3, height);
    gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.15)`);
    gradient.addColorStop(0.5, '#0a0a0a');
    gradient.addColorStop(1, '#000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const lines = 20;
    for (let i = 0; i < lines; i++) {
      const startX = width * 0.1 + Math.sin(time * 0.005 + i * 0.5) * 50;
      const startY = height * 0.2 + i * height * 0.03;
      const lineLength = width * 0.3 + Math.sin(time * 0.01 + i) * 100;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX + lineLength, startY + Math.sin(time * 0.02 + i * 2) * 5);
      ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${0.08 - i * 0.003})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    const inkDrops = 8;
    for (let i = 0; i < inkDrops; i++) {
      const dropX = width * 0.2 + i * width * 0.08;
      const dropY = height * 0.4 + Math.sin(time * 0.01 + i * 3) * height * 0.1;
      const dropSize = 15 + Math.sin(time * 0.02 + i * 2) * 10;
      
      ctx.beginPath();
      ctx.arc(dropX, dropY, dropSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${0.12 - i * 0.01})`;
      ctx.fill();
      
      if (dropSize > 20) {
        ctx.beginPath();
        ctx.arc(dropX, dropY, dropSize * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.04)`;
        ctx.fill();
      }
    }

    const paperWidth = width * 0.4;
    const paperHeight = height * 0.5;
    const paperX = width * 0.55;
    const paperY = height * 0.25;
    
    const paperGradient = ctx.createLinearGradient(paperX, paperY, paperX + paperWidth, paperY);
    paperGradient.addColorStop(0, 'rgba(255, 255, 255, 0.03)');
    paperGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.02)');
    paperGradient.addColorStop(1, 'rgba(255, 255, 255, 0.01)');
    
    ctx.fillStyle = paperGradient;
    ctx.fillRect(paperX, paperY, paperWidth, paperHeight);
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.strokeRect(paperX, paperY, paperWidth, paperHeight);

    const textLines = 10;
    ctx.font = '12px monospace';
    for (let i = 0; i < textLines; i++) {
      const lineY = paperY + 30 + i * 25;
      const alpha = 0.08 + (i / textLines) * 0.04;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      
      const textLength = 30 + Math.floor(Math.random() * 20);
      const text = Array(textLength).fill('—').join('');
      ctx.fillText(text, paperX + 20, lineY);
    }

    const vignette = ctx.createRadialGradient(
      width * 0.5, height * 0.5, height * 0.3,
      width * 0.5, height * 0.5, width * 0.7
    );
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
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
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const segmentProgress = 1 / products.length;
    const currentIndex = Math.floor(scrollProgress * products.length);
    const safeIndex = Math.min(currentIndex, products.length - 1);
    const localProgress = (scrollProgress - safeIndex * segmentProgress) / segmentProgress;

    const product = products[safeIndex];
    const color = parseColor(product.accentColor);

    timeRef.current += 1;
    const time = timeRef.current;

    if (product.id === 'boka') {
      drawBokaScene(ctx, width, height, time, color);
    } else if (product.id === 'bole') {
      drawBoleScene(ctx, width, height, time, color);
    } else if (product.id === 'bowen') {
      drawBowenScene(ctx, width, height, time, color);
    }

    if (safeIndex < products.length - 1) {
      const nextProduct = products[safeIndex + 1];
      const nextColor = parseColor(nextProduct.accentColor);
      const transitionProgress = Math.max(0, Math.min(1, (localProgress - 0.7) / 0.3));

      if (transitionProgress > 0) {
        ctx.globalAlpha = transitionProgress;
        if (nextProduct.id === 'boka') {
          drawBokaScene(ctx, width, height, time, nextColor);
        } else if (nextProduct.id === 'bole') {
          drawBoleScene(ctx, width, height, time, nextColor);
        } else if (nextProduct.id === 'bowen') {
          drawBowenScene(ctx, width, height, time, nextColor);
        }
        ctx.globalAlpha = 1;
      }
    }

  }, [scrollProgress, products, drawBokaScene, drawBoleScene, drawBowenScene]);

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
      style={{ background: '#000' }}
    />
  );
}