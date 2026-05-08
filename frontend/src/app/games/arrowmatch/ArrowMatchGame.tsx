import React, { useState } from 'react';
import type { GamePluginProps } from '../_types';
import { PrimaryButton } from '../../components/ui/PrimaryButton';

interface Side { id: string; label: string }

export function ArrowMatchGame({ game, accent, onAnswer, onComplete }: GamePluginProps) {
  const left = (game.payload.leftAr as Side[]) ?? [];
  const right = (game.payload.rightAr as Side[]) ?? [];
  const [pairs, setPairs] = useState<{ from: string; to: string }[]>([]);
  const [draftFrom, setDraftFrom] = useState<string | null>(null);
  const [done, setDone] = useState<{ correct: boolean } | null>(null);

  const submit = async () => {
    const r = await onAnswer(pairs);
    setDone({ correct: r.correct });
  };
  const reset = () => {
    setPairs([]);
    setDraftFrom(null);
    setDone(null);
  };

  return (
    <div className="flex flex-col gap-6 max-w-[820px] w-full mx-auto">
      <div className="grid grid-cols-2 gap-10">
        <div className="flex flex-col gap-3">
          {left.map((it) => {
            const matched = pairs.some((p) => p.from === it.id);
            const drafting = draftFrom === it.id;
            return (
              <button
                key={it.id}
                onClick={() => setDraftFrom(it.id)}
                className="rounded-2xl px-4 py-3 text-start"
                style={{
                  background: drafting
                    ? `linear-gradient(135deg, ${accent}55, ${accent}22)`
                    : matched
                    ? `linear-gradient(135deg, ${accent}33, ${accent}11)`
                    : 'rgba(255,255,255,0.06)',
                  border: `2px solid ${drafting ? accent : matched ? `${accent}88` : 'rgba(255,255,255,0.1)'}`,
                  fontFamily: 'Cairo',
                  fontWeight: 700,
                  color: 'white'
                }}
              >
                {it.label}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-3">
          {right.map((it) => {
            const matched = pairs.some((p) => p.to === it.id);
            return (
              <button
                key={it.id}
                onClick={() => {
                  if (!draftFrom) return;
                  setPairs((p) => [
                    ...p.filter((x) => x.from !== draftFrom && x.to !== it.id),
                    { from: draftFrom, to: it.id }
                  ]);
                  setDraftFrom(null);
                }}
                disabled={!draftFrom && !matched}
                className="rounded-2xl px-4 py-3 text-start"
                style={{
                  background: matched
                    ? `linear-gradient(135deg, ${accent}33, ${accent}11)`
                    : 'rgba(255,255,255,0.06)',
                  border: `2px solid ${matched ? `${accent}88` : 'rgba(255,255,255,0.1)'}`,
                  fontFamily: 'Cairo',
                  fontWeight: 700,
                  color: 'white',
                  opacity: !draftFrom && !matched ? 0.6 : 1
                }}
              >
                {it.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex justify-center gap-2">
        <button
          onClick={reset}
          className="text-white/60 hover:text-white text-sm"
          style={{ fontFamily: 'Cairo', fontWeight: 700 }}
        >
          إعادة
        </button>
        {!done ? (
          <PrimaryButton
            onClick={submit}
            disabled={pairs.length !== left.length}
            gradient={[accent, accent, accent]}
          >
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
