import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Zap, Lightbulb, Timer, Sparkles } from 'lucide-react';

import type { GamePluginProps } from '../_types';
import type { QuizItemAr } from '@/lib/types';
import { PrimaryButton } from '../../components/ui/PrimaryButton';

interface TimeRushPayload {
  timeRush?: boolean;
  timePerQuestionMs?: number;
  lifeline50_50?: boolean;
  items: QuizItemAr[];
  // Legacy single-question fallback
  questionAr?: string;
  optionsAr?: string[];
}

function multiplierFor(streak: number): { value: number; label: string | null } {
  if (streak >= 10) return { value: 10, label: '×10 LEGENDARY' };
  if (streak >= 8) return { value: 5, label: '×5 INFERNO' };
  if (streak >= 5) return { value: 3, label: '×3 STREAK' };
  if (streak >= 3) return { value: 2, label: '×2 COMBO' };
  return { value: 1, label: null };
}

export function QuizGame({ game, accent, onAnswer, onComplete }: GamePluginProps) {
  const payload = game.payload as TimeRushPayload;

  // Adapt legacy single-question quiz to the items[] interface so this single
  // component handles both the new Time-Rush packs and any older content.
  const items = useMemo<QuizItemAr[]>(() => {
    if (payload.items?.length) return payload.items;
    if (payload.questionAr && payload.optionsAr) {
      return [
        {
          questionAr: payload.questionAr,
          optionsAr: payload.optionsAr,
          correctIndex: (game as any).correctIndex ?? 0
        }
      ];
    }
    return [];
  }, [payload, game]);

  const totalTimeMs = payload.timePerQuestionMs ?? 22_000;
  const lifelineEnabled = payload.lifeline50_50 ?? true;

  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [hiddenChoices, setHiddenChoices] = useState<number[]>([]);
  const [lifelineUsed, setLifelineUsed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(totalTimeMs);
  const [phase, setPhase] = useState<'play' | 'feedback'>('play');
  const [busy, setBusy] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const tickRef = useRef<number | null>(null);

  const item = items[idx];
  const mult = multiplierFor(streak);

  // Timer reset per question
  useEffect(() => {
    if (phase !== 'play') return;
    setTimeLeft(totalTimeMs);
    const start = performance.now();
    const tick = () => {
      const left = Math.max(0, totalTimeMs - (performance.now() - start));
      setTimeLeft(left);
      if (left <= 0) {
        void handlePick(-1, true);
        return;
      }
      tickRef.current = requestAnimationFrame(tick);
    };
    tickRef.current = requestAnimationFrame(tick);
    return () => {
      if (tickRef.current != null) cancelAnimationFrame(tickRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, phase]);

  const usePick = lifelineEnabled && !lifelineUsed;

  const handle50_50 = () => {
    if (!usePick || !item) return;
    const wrong = item.optionsAr
      .map((_, i) => i)
      .filter((i) => i !== item.correctIndex);
    const shuffled = [...wrong].sort(() => Math.random() - 0.5);
    setHiddenChoices(shuffled.slice(0, 2));
    setLifelineUsed(true);
  };

  const handlePick = async (choiceIndex: number, timedOut = false) => {
    if (phase !== 'play' || busy) return;
    setBusy(true);
    setPicked(choiceIndex);
    const correct = !timedOut && choiceIndex === item.correctIndex;
    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      const m = multiplierFor(newStreak).value;
      try {
        await onAnswer({
          correct: true,
          multiplier: m,
          itemIndex: idx,
          choiceIndex
        });
      } catch {}
      setScore((s) => ({ correct: s.correct + 1, total: s.total + 1 }));
    } else {
      setStreak(0);
      try {
        await onAnswer({ correct: false, itemIndex: idx, choiceIndex });
      } catch {}
      setScore((s) => ({ ...s, total: s.total + 1 }));
    }
    setPhase('feedback');
    setBusy(false);
  };

  const next = () => {
    setHiddenChoices([]);
    setPicked(null);
    setPhase('play');
    if (idx + 1 < items.length) {
      setIdx(idx + 1);
    } else {
      onComplete();
    }
  };

  if (!item) {
    return (
      <div className="text-white/70 p-8 text-center" style={{ fontFamily: 'Cairo' }}>
        لا توجد أسئلة في هذه اللعبة.
      </div>
    );
  }

  const timePct = Math.max(0, Math.min(100, (timeLeft / totalTimeMs) * 100));
  const isCorrect = picked === item.correctIndex;

  return (
    <div className="flex flex-col gap-5 max-w-[680px] w-full mx-auto">
      {/* Top HUD */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span
            className="rounded-full px-3 py-1 text-xs"
            style={{
              fontFamily: 'Cairo',
              fontWeight: 800,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'white'
            }}
          >
            سؤال {idx + 1} / {items.length}
          </span>
          {mult.label && (
            <motion.span
              key={mult.label}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-full px-3 py-1 text-xs inline-flex items-center gap-1"
              style={{
                fontFamily: 'Cairo',
                fontWeight: 900,
                background: `linear-gradient(135deg, #FBBF24, #EF4444)`,
                color: 'white',
                boxShadow: '0 8px 24px rgba(245,158,11,0.4)'
              }}
            >
              <Zap size={12} />
              {mult.label}
            </motion.span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span
            className="rounded-full px-3 py-1 text-xs inline-flex items-center gap-1"
            style={{
              fontFamily: 'Cairo',
              fontWeight: 800,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: streak > 0 ? '#FACC15' : 'white'
            }}
          >
            <Sparkles size={12} className={streak > 0 ? 'text-yellow-300' : 'text-white/60'} />
            {streak} متتالي
          </span>
          {lifelineEnabled && (
            <button
              disabled={lifelineUsed || phase !== 'play'}
              onClick={handle50_50}
              className="rounded-full px-3 py-1 text-xs disabled:opacity-30 transition-colors"
              style={{
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 800,
                background: lifelineUsed
                  ? 'rgba(255,255,255,0.04)'
                  : 'linear-gradient(135deg, rgba(96,165,250,0.18), rgba(167,139,250,0.18))',
                border: `1px solid ${lifelineUsed ? 'rgba(255,255,255,0.10)' : 'rgba(96,165,250,0.45)'}`,
                color: 'white'
              }}
            >
              50/50
            </button>
          )}
        </div>
      </div>

      {/* Timer bar */}
      <div className="relative h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full"
          animate={{ width: `${timePct}%` }}
          transition={{ duration: 0.1, ease: 'linear' }}
          style={{
            background:
              timePct > 35
                ? 'linear-gradient(90deg, #34D399, #FBBF24)'
                : 'linear-gradient(90deg, #F43F5E, #EF4444)'
          }}
        />
      </div>
      <div className="flex items-center justify-end gap-1 -mt-3">
        <Timer size={12} className="text-white/40" />
        <span className="text-white/55" style={{ fontFamily: 'Cairo', fontSize: 11 }}>
          {Math.ceil(timeLeft / 1000)}ث
        </span>
      </div>

      {/* Question */}
      <h2
        className="text-white text-center"
        style={{ fontFamily: 'Cairo', fontWeight: 800, fontSize: 22, lineHeight: 1.5 }}
      >
        {item.questionAr}
      </h2>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {item.optionsAr.map((opt, i) => {
          const isHidden = hiddenChoices.includes(i);
          const showCorrect = phase === 'feedback' && i === item.correctIndex;
          const showWrong = phase === 'feedback' && picked === i && i !== item.correctIndex;
          const isPicked = picked === i;
          return (
            <motion.button
              key={i}
              whileHover={phase === 'play' ? { y: -2 } : {}}
              whileTap={phase === 'play' ? { scale: 0.98 } : {}}
              onClick={() => phase === 'play' && !isHidden && handlePick(i)}
              disabled={phase !== 'play' || isHidden}
              className="rounded-2xl px-5 py-4 text-start transition-all"
              style={{
                background: showCorrect
                  ? 'linear-gradient(135deg, rgba(34,197,94,0.3), rgba(34,197,94,0.1))'
                  : showWrong
                  ? 'linear-gradient(135deg, rgba(244,63,94,0.3), rgba(244,63,94,0.1))'
                  : isPicked
                  ? `linear-gradient(135deg, ${accent}33, ${accent}11)`
                  : 'rgba(255,255,255,0.06)',
                border: `2px solid ${
                  showCorrect ? '#22C55E' : showWrong ? '#F43F5E' : isPicked ? accent : 'rgba(255,255,255,0.10)'
                }`,
                fontFamily: 'Cairo',
                fontWeight: 700,
                fontSize: 16,
                color: 'white',
                opacity: isHidden ? 0.25 : 1,
                filter: isHidden ? 'grayscale(0.6)' : 'none',
                cursor: isHidden ? 'not-allowed' : phase === 'play' ? 'pointer' : 'default'
              }}
            >
              <span className="inline-flex items-center gap-2">
                <span
                  className="w-7 h-7 rounded-full grid place-items-center text-xs"
                  style={{
                    background: isPicked ? accent : 'rgba(255,255,255,0.12)',
                    color: 'white'
                  }}
                >
                  {String.fromCharCode(0x0623 + i)}
                </span>
                {opt}
                {showCorrect && <Check size={18} className="ms-auto text-emerald-400" />}
                {showWrong && <X size={18} className="ms-auto text-rose-400" />}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Feedback panel */}
      <AnimatePresence>
        {phase === 'feedback' && item.explanationAr && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl p-4 flex items-start gap-3"
            style={{
              background: isCorrect
                ? 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))'
                : 'linear-gradient(135deg, rgba(96,165,250,0.15), rgba(96,165,250,0.05))',
              border: `1px solid ${isCorrect ? 'rgba(34,197,94,0.45)' : 'rgba(96,165,250,0.45)'}`
            }}
          >
            <Lightbulb
              size={20}
              className={isCorrect ? 'text-emerald-300 flex-shrink-0' : 'text-sky-300 flex-shrink-0'}
            />
            <div>
              <p
                className="text-white"
                style={{ fontFamily: 'Cairo', fontWeight: 800, fontSize: 14, marginBottom: 4 }}
              >
                {isCorrect ? 'إجابة صحيحة!' : 'لنوضّح الفكرة'}
              </p>
              <p
                className="text-white/80"
                style={{ fontFamily: 'Cairo', fontSize: 14, lineHeight: 1.7 }}
              >
                {item.explanationAr}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center mt-2">
        {phase === 'feedback' && (
          <PrimaryButton onClick={next} gradient={[accent, accent, accent]}>
            {idx + 1 < items.length ? 'السؤال التالي' : 'إنهاء'}
          </PrimaryButton>
        )}
      </div>

      {phase === 'feedback' && idx + 1 === items.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-white/70 -mt-2"
          style={{ fontFamily: 'Cairo', fontSize: 13 }}
        >
          نتيجتك: {score.correct} / {score.total}
        </motion.div>
      )}
    </div>
  );
}
