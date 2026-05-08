import React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';

type Props = HTMLMotionProps<'button'> & {
  gradient?: [string, string, string?];
  fullWidth?: boolean;
};

export function PrimaryButton({
  gradient = ['#7C3AED', '#A855F7', '#EC4899'],
  fullWidth,
  className = '',
  style,
  children,
  ...rest
}: Props) {
  const bg =
    gradient.length === 3
      ? `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]}, ${gradient[2]})`
      : `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`;
  return (
    <motion.button
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.97 }}
      className={`relative overflow-hidden rounded-2xl px-6 py-4 text-white ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      style={{
        background: bg,
        fontFamily: 'Cairo, Fredoka One, sans-serif',
        fontWeight: 800,
        letterSpacing: 0.5,
        boxShadow: `0 12px 40px ${gradient[0]}55, inset 0 1px 0 rgba(255,255,255,0.25)`,
        ...style
      }}
      {...rest}
    >
      <span className="relative z-10">{children}</span>
      <motion.span
        aria-hidden
        className="absolute inset-0 bg-white/20"
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.6 }}
        style={{ skewX: -20 }}
      />
    </motion.button>
  );
}
