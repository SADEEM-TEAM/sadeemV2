import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';

interface MagneticCtaProps {
  children: React.ReactNode;
  onClick?: () => void;
  gradient?: [string, string, string];
  className?: string;
}

export function MagneticCta({
  children,
  onClick,
  gradient = ['#FBBF24', '#F59E0B', '#EF4444'],
  className = ''
}: MagneticCtaProps) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) * 0.25;
    const dy = (e.clientY - cy) * 0.25;
    setPos({ x: dx, y: dy });
  };

  const reset = () => setPos({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      onClick={onClick}
      animate={{ x: pos.x, y: pos.y }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 240, damping: 20 }}
      className={`relative group rounded-full px-9 py-5 text-white overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]}, ${gradient[2]})`,
        boxShadow: `0 16px 50px ${gradient[0]}55, inset 0 1px 0 rgba(255,255,255,0.3)`,
        fontFamily: 'Cairo, sans-serif',
        fontWeight: 900,
        fontSize: 19,
        letterSpacing: 0.5
      }}
    >
      {/* moving sheen */}
      <motion.span
        aria-hidden
        className="absolute inset-0 bg-white/25"
        animate={{ x: ['-120%', '220%'] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.4 }}
        style={{ skewX: -25 }}
      />
      {/* outer ring on hover */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full transition-opacity opacity-0 group-hover:opacity-100"
        style={{
          boxShadow: `0 0 0 6px ${gradient[0]}22, 0 0 60px ${gradient[1]}55`
        }}
      />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
