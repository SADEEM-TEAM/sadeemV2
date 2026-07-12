import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2 } from 'lucide-react';

import type { GameType } from '@/lib/types';

// ── Discreet dev launcher: jump straight into any mini-game for the demo,
// skipping the whole lesson circuit. Sits on the screen edge (see red circle
// in the brief screenshot). Intended for presentation/testing, not students.

const GAMES: Array<{ type: GameType; labelAr: string; emoji: string }> = [
  { type: 'tankattack', labelAr: 'هجوم الدبابات', emoji: '🎯' },
  { type: 'quiz', labelAr: 'كويز — Time Rush', emoji: '⚡' },
  { type: 'flashcard', labelAr: 'بطاقات', emoji: '🃏' },
  { type: 'dragdrop', labelAr: 'سحب وإفلات', emoji: '✋' },
  { type: 'arrowmatch', labelAr: 'ربط بالأسهم', emoji: '🔗' },
  { type: 'imagepuzzle', labelAr: 'أحجية الصورة', emoji: '🧩' }
];

export function DevGameMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const go = (type: GameType) => {
    setOpen(false);
    navigate(`/app/dev/game/${type}`);
  };

  return (
    <>
      {/* Trigger — small tab on the inline-start edge, vertically centered */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="قائمة الألعاب السريعة (عرض)"
        className="fixed z-[60] top-1/2 -translate-y-1/2 grid place-items-center"
        style={{
          insetInlineStart: 0,
          width: 26,
          height: 54,
          borderStartEndRadius: 14,
          borderEndEndRadius: 14,
          background: 'linear-gradient(135deg, rgba(167,139,250,0.30), rgba(96,165,250,0.22))',
          border: '1px solid rgba(167,139,250,0.45)',
          borderInlineStart: 'none',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          color: 'rgba(255,255,255,0.75)',
          boxShadow: '0 8px 22px rgba(0,0,0,0.35)'
        }}
      >
        <Gamepad2 size={15} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* click-away backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[59]"
            />
            <motion.div
              dir="rtl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed z-[61] top-1/2 -translate-y-1/2 rounded-2xl p-2 flex flex-col gap-1"
              style={{
                insetInlineStart: 34,
                minWidth: 190,
                background: 'rgba(16,10,40,0.92)',
                border: '1px solid rgba(167,139,250,0.30)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.55)'
              }}
            >
              <p
                className="px-2 py-1 text-[11px]"
                style={{ fontFamily: 'Cairo', fontWeight: 800, color: '#C4B5FD' }}
              >
                تشغيل لعبة مباشرة
              </p>
              {GAMES.map((g) => (
                <button
                  key={g.type}
                  onClick={() => go(g.type)}
                  className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-white/85 hover:text-white transition-colors text-start"
                  style={{ fontFamily: 'Cairo', fontWeight: 700, fontSize: 13 }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ fontSize: 16 }}>{g.emoji}</span>
                  {g.labelAr}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
