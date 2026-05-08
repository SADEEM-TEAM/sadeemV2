import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, RefreshCw, AlertCircle, Eye } from 'lucide-react';

import type { GamePluginProps } from '../_types';
import type { FlashcardAr } from '@/lib/types';
import { PrimaryButton } from '../../components/ui/PrimaryButton';

interface FlashcardPayload {
  progressiveReveal?: boolean;
  selfGrade?: boolean;
  cardsAr: FlashcardAr[];
}

type Grade = 'gotIt' | 'maybe' | 'stuck';

interface CardState {
  card: FlashcardAr;
  attempts: number;
  lastGrade?: Grade;
}

export function FlashcardGame({ game, accent, onAnswer, onComplete }: GamePluginProps) {
  const payload = game.payload as FlashcardPayload;
  const useProgressive = payload.progressiveReveal ?? true;
  const useSelfGrade = payload.selfGrade ?? true;

  const [queue, setQueue] = useState<CardState[]>(() =>
    (payload.cardsAr || []).map((c) => ({ card: c, attempts: 0 }))
  );
  const [revealed, setRevealed] = useState(false);
  const [revealProgress, setRevealProgress] = useState(0);
  const [tally, setTally] = useState({ gotIt: 0, maybe: 0, stuck: 0, seen: 0 });
  const [done, setDone] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const totalUnique = useMemo(() => (payload.cardsAr || []).length, [payload.cardsAr]);
  const tickRef = useRef<number | null>(null);

  const current = queue[0];

  useEffect(() => {
    if (!revealed || !useProgressive) return;
    setRevealProgress(0);
    const start = performance.now();
    const dur = 5000;
    const step = () => {
      const t = Math.min(1, (performance.now() - start) / dur);
      setRevealProgress(t);
      if (t < 1) tickRef.current = requestAnimationFrame(step);
    };
    tickRef.current = requestAnimationFrame(step);
    return () => {
      if (tickRef.current != null) cancelAnimationFrame(tickRef.current);
    };
  }, [revealed, useProgressive, current?.card.id]);

  useEffect(() => {
    setRevealed(false);
    setRevealProgress(0);
  }, [current?.card.id]);

  const skipReveal = () => setRevealProgress(1);

  const grade = (g: Grade) => {
    if (!current) return;
    setTally((t) => ({
      ...t,
      [g]: t[g] + 1,
      seen: t.seen + 1
    }));
    setQueue((q) => {
      const [head, ...rest] = q;
      const updated = { ...head, attempts: head.attempts + 1, lastGrade: g };
      if (g === 'gotIt') return rest;
      if (g === 'maybe') {
        const insertAt = Math.min(rest.length, 2);
        const next = [...rest];
        next.splice(insertAt, 0, updated);
        return next;
      }
      const insertAt = Math.min(rest.length, 1);
      const next = [...rest];
      next.splice(insertAt, 0, updated);
      return next;
    });
  };

  useEffect(() => {
    if (queue.length > 0 || done) return;
    if (totalUnique === 0) return;
    setDone(true);
  }, [queue.length, done, totalUnique]);

  const finish = async () => {
    if (submitted) return;
    setSubmitted(true);
    try {
      await onAnswer({
        gotIt: tally.gotIt,
        maybe: tally.maybe,
        stuck: tally.stuck,
        total: totalUnique
      });
    } catch {}
    onComplete();
  };

  if (!current && !done) {
    return (
      <div className="text-white/70 p-8 text-center" style={{ fontFamily: 'Cairo' }}>
        لا توجد بطاقات.
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-5 max-w-[460px] w-full mx-auto text-center">
        <h2 className="text-white" style={{ fontFamily: 'Cairo', fontWeight: 900, fontSize: 22 }}>
          انتهت الجلسة
        </h2>
        <div
          className="rounded-3xl px-6 py-5 w-full"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(12px)'
          }}
        >
          <SummaryRow label="أتقنت" value={tally.gotIt} color="#34D399" />
          <SummaryRow label="ربّما" value={tally.maybe} color="#FACC15" />
          <SummaryRow label="عالقة" value={tally.stuck} color="#F87171" />
          <div className="my-3 h-px bg-white/10" />
          <SummaryRow label="بطاقات فريدة" value={totalUnique} color="#A78BFA" />
        </div>
        <PrimaryButton onClick={finish} gradient={[accent, accent, accent]} disabled={submitted}>
          إنهاء وكسب الـ XP
        </PrimaryButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 max-w-[640px] w-full mx-auto">
      <div className="w-full flex items-center justify-between text-xs" style={{ fontFamily: 'Cairo' }}>
        <span className="text-white/65">
          مراجَع: {tally.seen} / متبقّي: {queue.length}
        </span>
        <span className="text-white/65 inline-flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-emerald-300">
            <Check size={12} />
            {tally.gotIt}
          </span>
          <span className="inline-flex items-center gap-1 text-yellow-300">
            <AlertCircle size={12} />
            {tally.maybe}
          </span>
          <span className="inline-flex items-center gap-1 text-rose-300">
            <RefreshCw size={12} />
            {tally.stuck}
          </span>
        </span>
      </div>

      <div className="w-full" style={{ perspective: 1000 }}>
        <motion.div
          key={current.card.id}
          onClick={() => !revealed && setRevealed(true)}
          animate={{ rotateY: revealed ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          className="relative w-full h-[260px] cursor-pointer"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div
            className="absolute inset-0 rounded-3xl flex items-center justify-center p-8"
            style={{
              background: `linear-gradient(135deg, ${accent}33, ${accent}11)`,
              border: `2px solid ${accent}55`,
              backfaceVisibility: 'hidden',
              boxShadow: `0 18px 48px ${accent}33`
            }}
          >
            <p className="text-white text-center" style={{ fontFamily: 'Cairo', fontWeight: 800, fontSize: 26 }}>
              {current.card.frontAr}
            </p>
          </div>
          <div
            className="absolute inset-0 rounded-3xl flex items-center justify-center p-8"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: `2px solid rgba(255,255,255,0.18)`,
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <ProgressiveText
              text={current.card.backAr}
              progress={useProgressive ? revealProgress : 1}
            />
          </div>
        </motion.div>
      </div>

      {!revealed && (
        <p className="text-white/55 text-xs" style={{ fontFamily: 'Cairo' }}>
          فكّر في الإجابة، ثمّ اضغط على البطاقة لكشفها.
        </p>
      )}

      {revealed && useProgressive && revealProgress < 1 && (
        <button
          onClick={skipReveal}
          className="text-white/65 hover:text-white inline-flex items-center gap-1 text-xs"
          style={{ fontFamily: 'Cairo', fontWeight: 700 }}
        >
          <Eye size={12} />
          اكشف الإجابة كاملة
        </button>
      )}

      {revealed && useSelfGrade && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-2 w-full"
        >
          <GradeButton
            label="عالقة"
            sublabel="أرجعها قريباً"
            color="#F87171"
            icon={<RefreshCw size={16} />}
            onClick={() => grade('stuck')}
          />
          <GradeButton
            label="ربّما"
            sublabel="أحتاج مراجعة"
            color="#FACC15"
            icon={<AlertCircle size={16} />}
            onClick={() => grade('maybe')}
          />
          <GradeButton
            label="أتقنت"
            sublabel="أعرفها جيّداً"
            color="#34D399"
            icon={<Check size={16} />}
            onClick={() => grade('gotIt')}
          />
        </motion.div>
      )}
    </div>
  );
}

function ProgressiveText({ text, progress }: { text: string; progress: number }) {
  const visibleCount = Math.max(0, Math.floor(text.length * progress));
  return (
    <p
      className="text-white/85 text-center"
      style={{ fontFamily: 'Cairo', fontSize: 17, lineHeight: 1.85, minHeight: 60 }}
    >
      <span>{text.slice(0, visibleCount)}</span>
      <AnimatePresence>
        {progress < 1 && (
          <motion.span
            initial={{ opacity: 0.2 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 0.6, repeatType: 'reverse' }}
            className="inline-block w-2 h-5 ms-1 align-middle bg-white/60 rounded"
          />
        )}
      </AnimatePresence>
    </p>
  );
}

function GradeButton({
  label,
  sublabel,
  color,
  icon,
  onClick
}: {
  label: string;
  sublabel: string;
  color: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="rounded-2xl p-3 flex flex-col items-center gap-1"
      style={{
        background: `linear-gradient(135deg, ${color}22, ${color}08)`,
        border: `1.5px solid ${color}66`,
        color: 'white',
        fontFamily: 'Cairo, sans-serif'
      }}
    >
      <span style={{ color, display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 800 }}>
        {icon}
        {label}
      </span>
      <span className="text-white/55 text-xs" style={{ fontFamily: 'Cairo' }}>
        {sublabel}
      </span>
    </motion.button>
  );
}

function SummaryRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-white/75" style={{ fontFamily: 'Cairo' }}>
        {label}
      </span>
      <span style={{ fontFamily: 'Cairo', fontWeight: 900, color }}>{value}</span>
    </div>
  );
}
