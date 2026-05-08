import React, { useMemo } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

const STARS = Array.from({ length: 180 }, (_, i) => ({
  id: i,
  x: (i * 7 + i * i * 3) % 100,
  y: (i * 11 + i * 5) % 100,
  size: i % 7 === 0 ? 2.4 : i % 4 === 0 ? 1.6 : 1,
  delay: (i * 0.13) % 4,
  duration: 2 + (i % 5) * 0.6,
  opacity: 0.3 + (i % 7) * 0.1,
  depth: (i % 3) + 1
}));

const SHOOTING = Array.from({ length: 4 }, (_, i) => ({
  id: i,
  startX: 5 + (i * 23) % 70,
  startY: -10 - (i * 12) % 30,
  delay: 4 + i * 6
}));

export function LandingBackdrop() {
  const { scrollY } = useScroll();
  const yL1 = useTransform(scrollY, [0, 1200], [0, -80]);
  const yL2 = useTransform(scrollY, [0, 1200], [0, -180]);
  const yL3 = useTransform(scrollY, [0, 1200], [0, -300]);
  const layers = [yL1, yL2, yL3];

  const stars = useMemo(() => STARS, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Deep base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 25% 0%, #2a0b4a 0%, #100428 35%, #060118 70%, #03000d 100%)'
        }}
      />

      {/* Nebula glows */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.55 }}
        transition={{ duration: 2 }}
        className="absolute -top-[15%] left-[10%] w-[55%] h-[60%] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(167,139,250,0.45) 0%, transparent 70%)',
          filter: 'blur(80px)'
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.45 }}
        transition={{ duration: 2.4, delay: 0.3 }}
        className="absolute top-[25%] -right-[10%] w-[50%] h-[50%] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(244,114,182,0.3) 0%, transparent 70%)',
          filter: 'blur(90px)'
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 2.4, delay: 0.6 }}
        className="absolute bottom-[10%] left-[20%] w-[60%] h-[45%] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(96,165,250,0.28) 0%, transparent 70%)',
          filter: 'blur(90px)'
        }}
      />

      {/* Algerian-flag accent (warm) glow on top right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 2.6, delay: 0.4 }}
        className="absolute top-[5%] right-[8%] w-[28%] h-[28%] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(251,191,36,0.45) 0%, transparent 70%)',
          filter: 'blur(70px)'
        }}
      />

      {/* Stars in 3 parallax layers */}
      <svg className="absolute inset-0 w-full h-full" aria-hidden>
        {stars.map((s) => (
          <motion.circle
            key={s.id}
            cx={`${s.x}%`}
            cy={`${s.y}%`}
            r={s.size}
            fill="white"
            opacity={s.opacity}
            style={{ y: layers[s.depth - 1] }}
          >
            <animate
              attributeName="opacity"
              values={`${s.opacity * 0.35};${s.opacity};${s.opacity * 0.35}`}
              dur={`${s.duration}s`}
              repeatCount="indefinite"
              begin={`${s.delay}s`}
            />
          </motion.circle>
        ))}
      </svg>

      {/* Constellation lines (decorative) */}
      <svg className="absolute inset-0 w-full h-full opacity-20" aria-hidden>
        <motion.path
          d="M 12 18 L 24 14 L 31 22 L 22 28 L 12 18 M 31 22 L 42 25"
          stroke="rgba(167,139,250,0.6)"
          strokeWidth="0.4"
          fill="none"
          strokeDasharray="1.5 1.5"
          style={{ transform: 'scale(2)', transformOrigin: '0 0' }}
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>{/* Shooting stars */}
      {SHOOTING.map((s) => (
        <motion.div
          key={s.id}
          className="absolute"
          style={{
            left: `${s.startX}%`,
            top: `${s.startY}%`,
            width: 110,
            height: 2,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(167,139,250,0.7) 50%, transparent 100%)',
            borderRadius: 999,
            filter: 'blur(0.4px)'
          }}
          animate={{
            x: [0, 320],
            y: [0, 220],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            repeatDelay: 18,
            delay: s.delay,
            ease: 'easeOut'
          }}
        />
      ))}

      {/* Vignette so foreground always reads */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 35%, transparent 30%, rgba(0,0,0,0.35) 75%, rgba(0,0,0,0.6) 100%)'
        }}
      />
    </div>
  );
}