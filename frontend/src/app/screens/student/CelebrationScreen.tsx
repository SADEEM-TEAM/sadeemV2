import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Star, Sparkles } from 'lucide-react';

import { TopicBackdrop } from '../../components/topics/TopicBackdrop';
import { GlassCard } from '../../components/ui/GlassCard';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { useAuth } from '@/store/auth.store';

// End-of-level mascot art, picked from the artwork the user shipped.
// Mapping confirmed by the product owner: 4 → blue avatar, 6 → pink avatar.
import celebrationBlue from '@/assets/4-screen-4.png 1.svg';
import celebrationPink from '@/assets/6-screen-6.png 1.svg';

export function CelebrationScreen() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const fired = useRef(false);
  const user = useAuth((s) => s.user);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#FBBF24', '#A78BFA', '#60A5FA', '#34D399'] });
  }, []);

  return (
    <div className="relative min-h-[100dvh]">
      <TopicBackdrop topic="history" intensity={0.6} />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] gap-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.1, 1] }}
          transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        >
          <img
            src={user?.mascotPref === 'pink' ? celebrationPink : celebrationBlue}
            alt=""
            aria-hidden
            draggable={false}
            style={{
              width: 260,
              height: 260,
              objectFit: 'contain',
              filter: 'drop-shadow(0 22px 50px rgba(245,158,11,0.45))',
              userSelect: 'none',
              pointerEvents: 'none'
            }}
          />
        </motion.div>

        <h1 className="text-white" style={{ fontFamily: 'Cairo', fontWeight: 900, fontSize: 36 }}>
          أحسنت!
        </h1>

        <GlassCard accent="#FACC15" className="px-7 py-5 inline-flex items-center gap-3">
          <Sparkles size={20} className="text-yellow-300" />
          <span className="text-white" style={{ fontFamily: 'Cairo', fontWeight: 800 }}>
            مجموع نقاطك الآن: {user?.xp ?? 0} XP
          </span>
          <Star size={20} className="text-yellow-300" fill="#FACC15" />
        </GlassCard>

        <div className="flex items-center gap-3">
          <PrimaryButton
            onClick={() => navigate('/app')}
            gradient={['#FBBF24', '#F59E0B', '#EF4444']}
          >
            العودة إلى لوحة الانطلاق
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
