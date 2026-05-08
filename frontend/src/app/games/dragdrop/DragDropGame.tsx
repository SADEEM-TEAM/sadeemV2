import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { GamePluginProps } from '../_types';
import { PrimaryButton } from '../../components/ui/PrimaryButton';

interface Item { id: number | string; label: string }

export function DragDropGame({ game, accent, onAnswer, onComplete }: GamePluginProps) {
  const sources = (game.payload.sourcesAr as Item[]) ?? [];
  const targets = (game.payload.targetsAr as Item[]) ?? [];

  const [placements, setPlacements] = useState<Record<string, Item['id'] | null>>(
    () => Object.fromEntries(targets.map((t) => [String(t.id), null]))
  );
  const [dragging, setDragging] = useState<Item | null>(null);
  const [done, setDone] = useState<{ correct: boolean } | null>(null);

  const used = new Set(Object.values(placements).filter(Boolean) as Array<Item['id']>);
  const available = sources.filter((s) => !used.has(s.id));
  const allFilled = Object.values(placements).every((v) => v !== null);

  const submit = async () => {
    const answer = Object.entries(placements).map(([tid, sid]) => [sid, tid]);
    const r = await onAnswer(answer);
    setDone({ correct: r.correct });
  };

  const reset = () => {
    setPlacements(Object.fromEntries(targets.map((t) => [String(t.id), null])));
    setDone(null);
  };

  return (
    <div className="flex flex-col gap-6 max-w-[760px] w-full mx-auto">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {available.map((s) => (
          <motion.div
            key={s.id}
            draggable
            onDragStart={() => setDragging(s)}
            whileHover={{ y: -2 }}
            className="rounded-2xl px-4 py-2.5 cursor-grab active:cursor-grabbing select-none"
            style={{
              background: `linear-gradient(135deg, ${accent}33, ${accent}11)`,
              border: `1.5px solid ${accent}55`,
              fontFamily: 'Cairo',
              fontWeight: 700,
              color: 'white'
            }}
          >
            {s.label}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {targets.map((t) => {
          const placedId = placements[String(t.id)];
          const placed = sources.find((s) => s.id === placedId);
          return (
            <div
              key={t.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (!dragging) return;
                setPlacements((p) => ({ ...p, [String(t.id)]: dragging.id }));
                setDragging(null);
              }}
              className="rounded-2xl px-4 py-3 min-h-[64px] flex items-center justify-between gap-3"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: `2px dashed ${placed ? accent : 'rgba(255,255,255,0.15)'}`
              }}
            >
              <span className="text-white/70" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>
                {t.label}
              </span>
              <AnimatePresence>
                {placed && (
                  <motion.button
                    key={String(placed.id)}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    onClick={() => setPlacements((p) => ({ ...p, [String(t.id)]: null }))}
                    className="rounded-xl px-3 py-1.5"
                    style={{
                      background: `linear-gradient(135deg, ${accent}55, ${accent}22)`,
                      border: `1px solid ${accent}`,
                      fontFamily: 'Cairo',
                      fontWeight: 800,
                      color: 'white'
                    }}
                  >
                    {placed.label}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center">
        {!done ? (
          <PrimaryButton onClick={submit} disabled={!allFilled} gradient={[accent, accent, accent]}>
            تأكيد
          </PrimaryButton>
        ) : done.correct ? (
          <PrimaryButton onClick={onComplete} gradient={[accent, accent, accent]}>
            التالي
          </PrimaryButton>
        ) : (
          <PrimaryButton onClick={reset} gradient={['#F43F5E', '#EF4444', '#B91C1C']}>
            حاول مجدّداً
          </PrimaryButton>
        )}
      </div>
    </div>
  );
}
