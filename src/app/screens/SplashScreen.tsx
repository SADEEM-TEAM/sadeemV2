import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { SpaceBackground } from '../components/SpaceBackground';
import { Mascot } from '../components/Mascot';

export function SplashScreen() {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      <SpaceBackground />

      <div className="relative z-10 flex flex-col items-center justify-center gap-6 px-6 w-full max-w-[430px] mx-auto py-12">
        {/* Mascots + Logo */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : -40 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative flex items-end justify-center gap-0 mb-2"
        >
          {/* Left mascot */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="z-10"
          >
            <Mascot emotion="excited" size={90} />
          </motion.div>

          {/* Logo */}
          <div className="relative -mx-3 z-20 flex flex-col items-center">
            {/* Arabic logo text */}
            <div
              className="text-center select-none"
              style={{
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 900,
                fontSize: '72px',
                background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 30%, #FB923C 70%, #EF4444 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 4px 20px rgba(251,191,36,0.6))',
                lineHeight: 1,
                letterSpacing: '-2px',
              }}
            >
              سديم
            </div>
          </div>

          {/* Right mascot */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="z-10"
          >
            <Mascot emotion="happy" size={90} flip />
          </motion.div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: showContent ? 0.8 : 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-white/70 text-center"
          style={{ fontFamily: 'Nunito, sans-serif', fontSize: 16, fontStyle: 'italic' }}
        >
          Like a nebula where stars are formed...
        </motion.p>

        {/* App name Latin */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: showContent ? 1 : 0, scale: showContent ? 1 : 0.8 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center"
        >
          <span
            style={{
              fontFamily: 'Fredoka One, sans-serif',
              fontSize: 28,
              background: 'linear-gradient(90deg, #A78BFA, #60A5FA, #34D399)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '6px',
              textTransform: 'uppercase',
            }}
          >
            SADEEN
          </span>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-center"
        >
          <p className="text-white/60 text-sm" style={{ fontFamily: 'Nunito, sans-serif' }}>
            🇩🇿 Learn • Explore • Grow 🇩🇿
          </p>
        </motion.div>

        {/* Play Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 30 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="w-full mt-4"
        >
          <motion.button
            onClick={() => navigate('/galaxy')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-5 rounded-3xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #7C3AED, #A855F7, #EC4899)',
              boxShadow: '0 8px 32px rgba(124,58,237,0.6), inset 0 1px 0 rgba(255,255,255,0.3)',
              fontFamily: 'Fredoka One, sans-serif',
              fontSize: 24,
              color: 'white',
              letterSpacing: 2,
            }}
          >
            <span className="relative z-10">▶ PLAY</span>
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-white/20"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
              style={{ skewX: -20 }}
            />
          </motion.button>
        </motion.div>

        {/* Worlds preview badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showContent ? 1 : 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="flex gap-3 flex-wrap justify-center"
        >
          {['🌱 Math', '🏺 History', '🕌 Deen', '🏡 Manners', '🎨 Art'].map(w => (
            <span
              key={w}
              className="text-xs text-white/50 bg-white/5 border border-white/10 rounded-full px-3 py-1"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              {w}
            </span>
          ))}
        </motion.div>

        {/* Parent link */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: showContent ? 0.5 : 0 }}
          transition={{ delay: 1.4 }}
          onClick={() => navigate('/profile')}
          className="text-white/40 text-xs underline hover:text-white/60 transition-colors"
          style={{ fontFamily: 'Nunito, sans-serif' }}
        >
          Parents & Teachers Zone
        </motion.button>
      </div>
    </div>
  );
}
