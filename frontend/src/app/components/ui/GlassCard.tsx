import React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';

type Props = HTMLMotionProps<'div'> & {
  accent?: string;
  glow?: boolean;
};

export const GlassCard = React.forwardRef<HTMLDivElement, Props>(
  ({ accent, glow = true, className = '', style, children, ...rest }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={`relative rounded-3xl border backdrop-blur-xl ${className}`}
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)',
          borderColor: accent ? `${accent}55` : 'rgba(255,255,255,0.12)',
          boxShadow:
            glow && accent
              ? `0 16px 60px rgba(0,0,0,0.45), 0 0 35px ${accent}33, inset 0 1px 0 rgba(255,255,255,0.18)`
              : '0 16px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.12)',
          ...style
        }}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }
);
GlassCard.displayName = 'GlassCard';
