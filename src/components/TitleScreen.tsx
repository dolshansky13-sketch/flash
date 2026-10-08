import { useState, useEffect } from 'react';

interface Props {
  onStart: () => void;
}

export default function TitleScreen({ onStart }: Props) {
  const [flicker, setFlicker] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlicker(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-black to-pink-900/20" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <div className="mb-2 text-sm tracking-[0.5em] text-purple-400 uppercase font-mono">
          ◆ Comic-Con After Party ◆
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 mb-4 leading-tight">
          FLASH
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-white/90 mb-2">
          Photographer Sim
        </h2>
        <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto mb-12 leading-relaxed">
          You're the photographer at the hottest after-party of the convention.
          Capture stunning cosplays, build your portfolio, and become legendary.
        </p>

        <button
          onClick={onStart}
          className={`
            px-12 py-4 rounded-lg font-bold text-lg uppercase tracking-wider
            transition-all duration-300 transform hover:scale-105
            ${flicker
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
              : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-500/50'
            }
            hover:shadow-purple-500/70 hover:shadow-xl
          `}
        >
          📸 Start Shooting
        </button>

        <div className="mt-16 grid grid-cols-3 gap-8 text-center max-w-sm mx-auto">
          <div>
            <div className="text-2xl mb-1">📷</div>
            <div className="text-xs text-gray-500">Real Camera Settings</div>
          </div>
          <div>
            <div className="text-2xl mb-1">👗</div>
            <div className="text-xs text-gray-500">6 Cosplayers</div>
          </div>
          <div>
            <div className="text-2xl mb-1">🏆</div>
            <div className="text-xs text-gray-500">Build Portfolio</div>
          </div>
        </div>
      </div>

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        }}
      />
    </div>
  );
}
