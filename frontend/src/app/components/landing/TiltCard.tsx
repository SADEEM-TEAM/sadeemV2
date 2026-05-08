import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';

interface TiltCardProps {
  children: React.ReactNode;
  accent?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function TiltCard({ children, accent = '#A78BFA', className = '', style, onClick }: TiltCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, sheenX: 50, sheenY: 50 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({
      x: (py - 0.5) * -10,
      y: (px - 0.5) * 12,
      sheenX: px * 100,
      sheenY: py * 100
    });
  };
  const reset = () => setTilt({ x: 0, y: 0, sheenX: 50, sheenY: 50 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      onClick={onClick}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
        ...style
      }}
      className={`relative rounded-[28px] border backdrop-blur-xl cursor-pointer ${className}`}
    >
      <div
        className="absolute inset-0 rounded-[28px] pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${tilt.sheenX}% ${tilt.sheenY}%, ${accent}33 0%, transparent 50%)`
        }}
      />
      {children}
    </motion.div>
  );
}
