import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, RefreshCw } from 'lucide-react';

import { TopicBackdrop } from '../../components/topics/TopicBackdrop';
import { GAME_REGISTRY } from '../../games/_registry';
import { MOCK_LESSONS } from '@/lib/mock-data';
import type { GameType, MiniGameDoc } from '@/lib/types';

// ── Dev-only sandbox: run ANY single mini-game in isolation, no lesson circuit.
// Reached via the discreet dev launcher in AppLayout. Not part of the student flow.

const GAME_LABELS: Record<GameType, string> = {
  quiz: 'كويز — Time Rush',
  flashcard: 'بطاقات — Flashcards',
  dragdrop: 'سحب وإفلات',
  arrowmatch: 'ربط بالأسهم',
  imagepuzzle: 'أحجية الصورة',
  tankattack: 'هجوم الدبابات'
};

// Grab every mock game of a given type so we can cycle through variants.
function gamesOfType(type: GameType): MiniGameDoc[] {
  const out: MiniGameDoc[] = [];
  for (const rec of MOCK_LESSONS) {
    for (const g of rec.games) {
      if (g.gameType === type) out.push(g);
    }
  }
  return out;
}

export function DevGameScreen() {
  const { type } = useParams<{ type: GameType }>();
  const navigate = useNavigate();
  const [variant, setVariant] = useState(0);
  const [nonce, setNonce] = useState(0); // force-remount to replay

  const pool = useMemo(() => (type ? gamesOfType(type) : []), [type]);
  const game = pool[variant % Math.max(1, pool.length)];

  if (!type || !GAME_REGISTRY[type] || !game) {
    return (
      <div className="text-white p-8" style={{ fontFamily: 'Cairo' }} dir="rtl">
        لا توجد لعبة من هذا النوع في البيانات التجريبية: {type}
      </div>
    );
  }

  const Plugin = GAME_REGISTRY[type].Component;
  const accent = '#A78BFA';

  // Sandbox handlers: score locally, never touch the API / user state.
  const onAnswer = async (_answer: any) => ({ correct: true, xpEarned: game.xpReward, heartsLost: 0, errors: 0 });
  const onComplete = () => setNonce((n) => n + 1); // replay same game on finish

  return (
    <div className="relative min-h-[100dvh]" dir="rtl">
      <TopicBackdrop topic="history" />

      <div className="relative z-10 flex flex-col items-center pb-16">
        <div className="w-full max-w-[760px] mb-4 mt-2">
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => navigate('/app')}
              className="rounded-full w-9 h-9 grid place-items-center text-white/70 hover:text-white"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <X size={16} />
            </button>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs"
              style={{
                fontFamily: 'Cairo', fontWeight: 800,
                background: 'rgba(167,139,250,0.16)', color: '#C4B5FD',
                border: '1px solid rgba(167,139,250,0.4)'
              }}
            >
              <Sparkles size={12} /> وضع العرض — {GAME_LABELS[type]}
            </span>

            <div className="ms-auto flex items-center gap-2">
              {pool.length > 1 && (
                <button
                  onClick={() => { setVariant((v) => v + 1); setNonce((n) => n + 1); }}
                  className="rounded-full px-3 py-1.5 text-xs text-white/80 hover:text-white"
                  style={{ fontFamily: 'Cairo', fontWeight: 700, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  نسخة أخرى ({(variant % pool.length) + 1}/{pool.length})
                </button>
              )}
              <button
                onClick={() => setNonce((n) => n + 1)}
                className="rounded-full w-8 h-8 grid place-items-center text-white/70 hover:text-white"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
                title="إعادة"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>
          <p className="text-white/85 text-center" style={{ fontFamily: 'Cairo', fontWeight: 700, fontSize: 14 }}>
            {game.instructionAr}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${type}-${variant}-${nonce}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="w-full flex justify-center"
          >
            <Plugin game={game as any} accent={accent} onAnswer={onAnswer} onComplete={onComplete} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
