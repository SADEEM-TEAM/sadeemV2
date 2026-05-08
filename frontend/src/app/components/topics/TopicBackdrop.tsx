import React from 'react';
import { motion } from 'motion/react';
import type { CourseTopic } from '@/lib/types';

interface Palette {
  base: string;
  glow: string;
  nebula: string;
}

const PALETTE: Record<CourseTopic, Palette> = {
  history: {
    base: 'radial-gradient(ellipse at 50% -10%, rgba(245,158,11,0.18) 0%, rgba(67,30,7,0.6) 35%, #0a0510 75%, #060118 100%)',
    glow: 'rgba(245,158,11,0.30)',
    nebula: 'rgba(180,83,9,0.18)'
  },
  math: {
    base: 'radial-gradient(ellipse at 50% -10%, rgba(56,189,248,0.18) 0%, rgba(8,47,73,0.6) 35%, #050912 75%, #060118 100%)',
    glow: 'rgba(56,189,248,0.30)',
    nebula: 'rgba(59,130,246,0.18)'
  },
  coding: {
    base: 'radial-gradient(ellipse at 50% -10%, rgba(16,185,129,0.18) 0%, rgba(5,46,38,0.6) 35%, #050f0c 75%, #060118 100%)',
    glow: 'rgba(16,185,129,0.30)',
    nebula: 'rgba(20,184,166,0.18)'
  }
};

export function TopicBackdrop({ topic, intensity = 1 }: { topic: CourseTopic; intensity?: number }) {
  const palette = PALETTE[topic];
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0, background: palette.base }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.55 * intensity }}
        transition={{ duration: 1.4 }}
        className="absolute -top-[20%] left-[15%] w-[60%] h-[55%] rounded-full"
        style={{
          background: `radial-gradient(circle, ${palette.glow} 0%, transparent 70%)`,
          filter: 'blur(80px)'
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 * intensity }}
        transition={{ duration: 1.6, delay: 0.2 }}
        className="absolute bottom-[5%] right-[5%] w-[45%] h-[45%] rounded-full"
        style={{
          background: `radial-gradient(circle, ${palette.nebula} 0%, transparent 70%)`,
          filter: 'blur(70px)'
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse at 50% 30%, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 30%, black 30%, transparent 80%)'
        }}
      />
      <svg className="absolute inset-0 w-full h-full" aria-hidden>
        {Array.from({ length: 40 }).map((_, i) => {
          const x = (i * 7 + i * i * 3) % 100;
          const y = (i * 11 + i * 5) % 100;
          const r = i % 5 === 0 ? 1.4 : 0.8;
          const dur = 2 + (i % 4) * 0.5;
          const delay = (i * 0.17) % 3;
          return (
            <circle
              key={i}
              cx={`${x}%`}
              cy={`${y}%`}
              r={r}
              fill="white"
              opacity={0.4}
              style={{ animation: `topicTwinkle ${dur}s ${delay}s ease-in-out infinite alternate` }}
            />
          );
        })}
      </svg>
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 35%, transparent 35%, rgba(0,0,0,0.35) 80%, rgba(0,0,0,0.55) 100%)'
        }}
      />
      <style>{`
        @keyframes topicTwinkle {
          0% { opacity: 0.15; }
          100% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

export const TOPIC_PALETTE = PALETTE;
