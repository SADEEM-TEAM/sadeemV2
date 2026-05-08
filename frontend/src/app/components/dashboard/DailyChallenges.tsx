import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Check, Sparkles, Zap } from 'lucide-react';

import { api } from '@/lib/api';
import { useAuth } from '@/store/auth.store';

interface ChallengeItem {
  id: string;
  titleAr: string;
  goalAr: string;
  xp: number;
  claimed: boolean;
}

export function DailyChallenges() {
  const refresh = useAuth((s) => s.refresh);
  const [items, setItems] = useState<ChallengeItem[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = () => {
    api
      .get('/challenges/today')
      .then(({ data }) => setItems(data.data.items))
      .catch(() => setItems([]));
  };

  useEffect(load, []);

  const claim = async (id: string) => {
    if (busy) return;
    setBusy(id);
    try {
      await api.post(`/challenges/${id}/claim`);
      await refresh();
      load();
    } catch {
      load();
    } finally {
      setBusy(null);
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="flex items-center gap-2 mb-3">
        <Calendar size={18} className="text-yellow-300" />
        <h2 className="text-white" style={{ fontFamily: 'Cairo', fontWeight: 800, fontSize: 18 }}>
          تحدّيات اليوم
        </h2>
        <span className="text-white/55" style={{ fontFamily: 'Cairo', fontSize: 12 }}>
          (أكمل واحداً يومياً للحفاظ على السلسلة)
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {items.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 * i }}
            className="rounded-2xl p-4 relative overflow-hidden"
            style={{
              background: c.claimed
                ? 'linear-gradient(135deg, rgba(34,197,94,0.18) 0%, rgba(34,197,94,0.04) 100%)'
                : 'linear-gradient(135deg, rgba(251,191,36,0.12) 0%, rgba(239,68,68,0.06) 100%)',
              border: `1.5px solid ${c.claimed ? 'rgba(34,197,94,0.45)' : 'rgba(245,158,11,0.35)'}`,
              backdropFilter: 'blur(12px)'
            }}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h3 style={{ fontFamily: 'Cairo', fontWeight: 800, fontSize: 16, color: 'white' }}>
                  {c.titleAr}
                </h3>
                <p className="text-white/70 mt-0.5" style={{ fontFamily: 'Cairo', fontSize: 13, lineHeight: 1.6 }}>
                  {c.goalAr}
                </p>
              </div>
              <span
                className="rounded-full px-2.5 py-1 text-xs inline-flex items-center gap-1 flex-shrink-0"
                style={{
                  fontFamily: 'Cairo',
                  fontWeight: 800,
                  background: 'rgba(0,0,0,0.35)',
                  color: '#FACC15'
                }}
              >
                <Zap size={11} />
                +{c.xp}
              </span>
            </div>
            <button
              onClick={() => !c.claimed && claim(c.id)}
              disabled={c.claimed || busy === c.id}
              className="mt-3 rounded-xl px-3 py-2 text-xs w-full inline-flex items-center justify-center gap-1.5"
              style={{
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 800,
                background: c.claimed
                  ? 'rgba(34,197,94,0.18)'
                  : 'linear-gradient(135deg, #FBBF24, #F59E0B, #EF4444)',
                color: 'white',
                boxShadow: c.claimed ? 'none' : '0 8px 24px rgba(245,158,11,0.35)',
                cursor: c.claimed ? 'default' : 'pointer'
              }}
            >
              {c.claimed ? (
                <>
                  <Check size={14} />
                  تمّ المطالبة
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  استلم المكافأة
                </>
              )}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
