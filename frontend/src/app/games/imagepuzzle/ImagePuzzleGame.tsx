import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import type { GamePluginProps } from '../_types';
import { PrimaryButton } from '../../components/ui/PrimaryButton';

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function ImagePuzzleGame({ game, accent, onAnswer, onComplete }: GamePluginProps) {
  const cols = (game.payload.cols as number) || 3;
  const rows = (game.payload.rows as number) || 2;
  const total = cols * rows;
  const [order, setOrder] = useState<number[]>(() =>
    shuffle(Array.from({ length: total }, (_, i) => i))
  );
  const [done, setDone] = useState<{ correct: boolean } | null>(null);

  const submit = async () => {
    const r = await onAnswer(order);
    setDone({ correct: r.correct });
  };

  return (
    <div className="flex flex-col items-center gap-5 max-w-[640px] w-full mx-auto">
      <div
        className="grid w-full rounded-3xl overflow-hidden p-2"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`,
          aspectRatio: `${cols}/${rows}`,
          background: `linear-gradient(135deg, ${accent}33, ${accent}11)`,
          border: `2px solid ${accent}44`,
          gap: 6
        }}
      >
        {order.map((pieceIdx, slotIdx) => (
          <motion.button
            key={slotIdx}
            layout
            draggable
            onDragStart={(e: any) => e.dataTransfer?.setData('text/plain', String(slotIdx))}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const from = Number((e as any).dataTransfer.getData('text/plain'));
              if (!Number.isNaN(from)) {
                setOrder((o) => {
                  const next = [...o];
                  [next[from], next[slotIdx]] = [next[slotIdx], next[from]];
                  return next;
                });
              }
            }}
            className="rounded-xl border border-white/10 grid place-items-center cursor-grab"
            style={{
              background: `linear-gradient(135deg, ${accent}55, ${accent}22)`,
              fontFamily: 'Cairo',
              fontWeight: 900,
              fontSize: 28,
              color: 'white'
            }}
          >
            {pieceIdx + 1}
          </motion.button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setOrder(shuffle(Array.from({ length: total }, (_, i) => i)))}
          className="text-white/70 hover:text-white text-sm"
          style={{ fontFamily: 'Cairo', fontWeight: 700 }}
        >
          خلط
        </button>
        {!done ? (
          <PrimaryButton onClick={submit} gradient={[accent, accent, accent]}>
            تأكيد
          </PrimaryButton>
        ) : done.correct ? (
          <PrimaryButton onClick={onComplete} gradient={[accent, accent, accent]}>
            التالي
          </PrimaryButton>
        ) : (
          <PrimaryButton
            onClick={() => setOrder(shuffle(Array.from({ length: total }, (_, i) => i)))}
            gradient={['#F43F5E', '#EF4444', '#B91C1C']}
          >
            حاول مجدّداً
          </PrimaryButton>
        )}
      </div>
    </div>
  );
}
