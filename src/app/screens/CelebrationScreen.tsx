import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { SpaceBackground } from '../components/SpaceBackground';
import { Mascot } from '../components/Mascot';

interface CelebrationState {
  stars: number;
  gems: number;
  worldId: string;
  levelId: number;
  worldName: string;
  worldEmoji: string;
  worldColor: string;
  badge?: string;
  nextLevelId: number;
  hasNextLevel: boolean;
}

function StarIcon({ filled, delay }: { filled: boolean; delay: number }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -30 }}
      animate={filled ? { scale: 1, rotate: 0 } : { scale: 0.6, rotate: 0 }}
      transition={{ type: 'spring', delay, stiffness: 200, damping: 12 }}
      className="relative"
    >
      <svg width="72" height="72" viewBox="0 0 72 72">
        {/* Star shadow */}
        <polygon
          points="36,6 44,28 68,28 50,44 57,68 36,54 15,68 22,44 4,28 28,28"
          fill={filled ? '#92400e' : '#1a1a2e'}
          opacity="0.5"
          transform="translate(2,2)"
        />
        {/* Star body */}
        <polygon
          points="36,6 44,28 68,28 50,44 57,68 36,54 15,68 22,44 4,28 28,28"
          fill={filled ? '#FBBF24' : '#1e1b4b'}
          stroke={filled ? '#F59E0B' : '#312e81'}
          strokeWidth="2"
        />
        {/* Star shine */}
        {filled && (
          <>
            <polygon
              points="36,10 42,26 56,26 45,36 49,52 36,44 23,52 27,36 16,26 30,26"
              fill="#FDE68A"
              opacity="0.5"
            />
            <circle cx="28" cy="24" r="3" fill="white" opacity="0.6" />
          </>
        )}
      </svg>
      {filled && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [1, 0], scale: [1, 2] }}
          transition={{ delay: delay + 0.3, duration: 0.5 }}
          className="absolute inset-0 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.6) 0%, transparent 70%)' }}
        />
      )}
    </motion.div>
  );
}

export function CelebrationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as CelebrationState | null;

  const stars = state?.stars ?? 3;
  const gems = state?.gems ?? 30;
  const worldId = state?.worldId ?? 'math';
  const levelId = state?.levelId ?? 1;
  const worldName = state?.worldName ?? 'Math Garden';
  const worldEmoji = state?.worldEmoji ?? '🌱';
  const worldColor = state?.worldColor ?? '#22c55e';
  const badge = state?.badge;
  const hasNextLevel = state?.hasNextLevel ?? false;
  const nextLevelId = state?.nextLevelId ?? 2;

  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    // Fire confetti
    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.4 },
        colors: ['#FBBF24', '#A78BFA', '#60A5FA', '#34D399', '#F472B6'],
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.5 },
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.5 },
        });
      }, 400);
    }, 600);

    const badgeTimer = setTimeout(() => badge && setShowBadge(true), 2000);
    return () => { clearTimeout(timer); clearTimeout(badgeTimer); };
  }, [badge]);

  const getMessage = () => {
    if (stars === 3) return "PERFECT! You're a superstar! 🚀";
    if (stars === 2) return "Great job! Keep it up! 💪";
    return "Good try! Practice more! 🌱";
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <SpaceBackground />

      {/* Colored glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 40%, ${worldColor}60 0%, transparent 65%)`,
          opacity: 0.5,
          zIndex: 1,
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 max-w-[430px] mx-auto py-10 gap-6">
        {/* World badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{ background: `${worldColor}20`, border: `1px solid ${worldColor}50` }}
        >
          <span style={{ fontSize: 20 }}>{worldEmoji}</span>
          <span style={{ fontFamily: 'Nunito', fontWeight: 700, color: 'white', fontSize: 14 }}>
            Level {levelId} Complete!
          </span>
        </motion.div>

        {/* Mascot */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
        >
          <motion.div
            animate={{ rotate: [0, -8, 8, -8, 8, 0] }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Mascot emotion={stars === 3 ? 'celebrating' : stars === 2 ? 'excited' : 'happy'} size={120} />
          </motion.div>
        </motion.div>

        {/* Stars */}
        <div className="flex gap-3 items-center justify-center">
          {[1, 2, 3].map(i => (
            <StarIcon key={i} filled={i <= stars} delay={0.4 + (i - 1) * 0.2} />
          ))}
        </div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <h1
            className="text-white mb-1"
            style={{ fontFamily: 'Fredoka One', fontSize: 26, textShadow: `0 2px 20px ${worldColor}` }}
          >
            {getMessage()}
          </h1>
          <p style={{ fontFamily: 'Nunito', color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
            {worldName} • Level {levelId}
          </p>
        </motion.div>

        {/* Rewards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: 'spring' }}
          className="flex gap-4"
        >
          <div
            className="flex items-center gap-2 px-5 py-3 rounded-2xl"
            style={{ background: 'rgba(251,191,36,0.15)', border: '2px solid rgba(251,191,36,0.4)' }}
          >
            <span style={{ fontSize: 28 }}>⭐</span>
            <span style={{ fontFamily: 'Fredoka One', fontSize: 22, color: '#FBBF24' }}>+{stars}</span>
          </div>
          <div
            className="flex items-center gap-2 px-5 py-3 rounded-2xl"
            style={{ background: 'rgba(96,165,250,0.15)', border: '2px solid rgba(96,165,250,0.4)' }}
          >
            <span style={{ fontSize: 28 }}>💎</span>
            <span style={{ fontFamily: 'Fredoka One', fontSize: 22, color: '#60A5FA' }}>+{gems}</span>
          </div>
        </motion.div>

        {/* Badge earned */}
        {badge && showBadge && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring' }}
            className="px-6 py-4 rounded-3xl text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(167,139,250,0.2), rgba(96,165,250,0.2))',
              border: '2px solid rgba(167,139,250,0.5)',
            }}
          >
            <p style={{ fontFamily: 'Nunito', color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 4 }}>
              🏅 New Badge Earned!
            </p>
            <p style={{ fontFamily: 'Fredoka One', color: 'white', fontSize: 18 }}>{badge}</p>
          </motion.div>
        )}

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="flex gap-3 w-full"
        >
          <button
            onClick={() => navigate(`/world/${worldId}`)}
            className="flex-1 py-4 rounded-2xl border border-white/15 text-white/70 active:scale-95 transition-all"
            style={{ fontFamily: 'Nunito', fontWeight: 700 }}
          >
            🗺️ Map
          </button>

          <button
            onClick={() => navigate(`/play/${worldId}/${levelId}`)}
            className="flex-1 py-4 rounded-2xl border border-white/15 text-white/70 active:scale-95 transition-all"
            style={{ fontFamily: 'Nunito', fontWeight: 700 }}
          >
            🔄 Retry
          </button>

          {hasNextLevel && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/world/${worldId}`)}
              className="flex-[2] py-4 rounded-2xl text-white active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${worldColor}, ${worldColor}88)`,
                boxShadow: `0 4px 20px ${worldColor}60`,
                fontFamily: 'Fredoka One',
                fontSize: 18,
              }}
            >
              Next Level →
            </motion.button>
          )}
        </motion.div>

        <button
          onClick={() => navigate('/galaxy')}
          className="text-white/40 text-sm hover:text-white/60 transition-colors"
          style={{ fontFamily: 'Nunito' }}
        >
          Back to Galaxy Hub 🌌
        </button>
      </div>
    </div>
  );
}
