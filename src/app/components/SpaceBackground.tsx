import React, { useMemo } from 'react';

const STARS = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  x: (i * 7 + i * i * 3) % 100,
  y: (i * 11 + i * 5) % 100,
  size: i % 5 === 0 ? 2.5 : i % 3 === 0 ? 1.8 : 1.2,
  delay: (i * 0.13) % 3,
  duration: 2 + (i % 4) * 0.5,
  opacity: 0.4 + (i % 6) * 0.1,
}));

const SPARKLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: (i * 17 + 5) % 90 + 5,
  y: (i * 23 + 8) % 90 + 5,
  delay: i * 0.4,
}));

export function SpaceBackground({ worldGradient }: { worldGradient?: string }) {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Base gradient */}
      <div
        className={`absolute inset-0 ${worldGradient ? '' : 'bg-gradient-to-b from-[#060118] via-[#0e0730] to-[#0a0520]'}`}
        style={worldGradient ? { background: worldGradient } : undefined}
      />

      {/* Nebula glows */}
      <div className="absolute top-[-10%] left-[20%] w-[60%] h-[50%] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.6) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.5) 0%, transparent 70%)', filter: 'blur(50px)' }} />
      <div className="absolute top-[30%] left-[-10%] w-[35%] h-[35%] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.5) 0%, transparent 70%)', filter: 'blur(50px)' }} />

      {/* Stars */}
      <svg className="absolute inset-0 w-full h-full">
        {STARS.map(star => (
          <circle
            key={star.id}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.size}
            fill="white"
            style={{
              opacity: star.opacity,
              animation: `twinkle ${star.duration}s ${star.delay}s ease-in-out infinite alternate`,
            }}
          />
        ))}
      </svg>

      {/* Sparkles */}
      {SPARKLES.map(s => (
        <div
          key={s.id}
          className="absolute text-yellow-300"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            fontSize: '10px',
            opacity: 0.6,
            animation: `sparkle 3s ${s.delay}s ease-in-out infinite`,
          }}
        >
          ✦
        </div>
      ))}

      <style>{`
        @keyframes twinkle {
          0% { opacity: 0.2; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 0.8; transform: scale(1.2) rotate(180deg); }
        }
      `}</style>
    </div>
  );
}
