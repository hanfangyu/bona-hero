'use client';

interface Product {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  accentColor: string;
  gradientStart: string;
}

interface ProgressIndicatorProps {
  progress: number;
  products: Product[];
  isLogged: boolean;
}

export default function ProgressIndicator({ progress, products, isLogged }: ProgressIndicatorProps) {
  if (isLogged) return null;

  const currentIndex = Math.floor(progress * products.length);

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3">
      {products.map((product, index) => (
        <div key={product.id} className="flex items-center gap-4 relative">
          <span
            className="absolute -left-16 text-xs tracking-widest font-mono transition-all duration-400"
            style={{
              opacity: index === currentIndex ? 1 : 0.3,
              transform: index === currentIndex ? 'translateX(0)' : 'translateX(-8px)',
              color: index === currentIndex ? product.accentColor : 'rgba(255,255,255,0.3)',
            }}
          >
            0{index + 1}
          </span>
          
          <div className="relative w-1 h-24 rounded-full overflow-hidden bg-white/10">
            <div
              className="absolute top-0 left-0 w-full rounded-full transition-all duration-400 ease-out"
              style={{
                height: `${Math.max(0, Math.min(100, 
                  index < currentIndex ? 100 :
                  index === currentIndex ? ((progress - index / products.length) / (1 / products.length)) * 100 :
                  0
                ))}%`,
                backgroundColor: product.accentColor,
                boxShadow: index === currentIndex ? `0 0 10px ${product.accentColor}40` : 'none',
              }}
            />
            
            <div
              className="absolute w-3 h-3 rounded-full -left-1 transition-all duration-400"
              style={{
                top: index < currentIndex ? '100%' : 
                     index === currentIndex ? `${((progress - index / products.length) / (1 / products.length)) * 100}%` :
                     '0%',
                transform: 'translateY(-50%)',
                backgroundColor: product.accentColor,
                boxShadow: `0 0 8px ${product.accentColor}60`,
                opacity: index <= currentIndex ? 1 : 0.3,
              }}
            />
          </div>
          
          <span
            className="text-xs tracking-wider font-medium transition-all duration-400"
            style={{
              opacity: index === currentIndex ? 1 : 0.3,
              color: index === currentIndex ? product.accentColor : 'rgba(255,255,255,0.4)',
              fontWeight: index === currentIndex ? 600 : 400,
            }}
          >
            {product.title}
          </span>
        </div>
      ))}
      
      <div className="mt-6 flex justify-end pr-12">
        <div className="text-xs text-white/40 font-mono">
          {Math.floor(progress * 100)}%
        </div>
      </div>
    </div>
  );
}