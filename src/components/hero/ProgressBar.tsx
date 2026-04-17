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