import React from 'react';
import { motion } from 'motion/react';

interface StarRatingProps {
  stars: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  stars,
  maxStars = 3,
  size = 'md',
  animate = false,
}) => {
  const sizeMap = { sm: 'text-xl', md: 'text-3xl', lg: 'text-5xl' };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxStars }).map((_, i) => (
        <motion.span
          key={i}
          className={sizeMap[size]}
          initial={animate ? { scale: 0, opacity: 0 } : {}}
          animate={animate ? { scale: 1, opacity: 1 } : {}}
          transition={animate ? { delay: i * 0.3 + 0.2, type: 'spring', stiffness: 400 } : {}}
          style={{
            filter: i < stars ? 'drop-shadow(0 0 8px #FFD700)' : 'grayscale(100%) opacity(0.35)',
          }}
        >
          ⭐
        </motion.span>
      ))}
    </div>
  );
};
