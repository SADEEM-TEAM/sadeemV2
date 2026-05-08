import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Crown, Trophy, Flame, Sparkles, Star } from 'lucide-react';

import { LandingBackdrop } from '../../components/landing/LandingBackdrop';
import { Mascot } from '../../components/Mascot';
import { api } from '@/lib/api';
import type { MascotPref } from '@/lib/types';

interface LeaderboardRow {
  _id: string;
  username: string;
  xp: number;
  streak: number;
  mascotPref: MascotPref;
  rank: number;
  isMe?: boolean;
}

export function LeaderboardScreen() {
  const [rows, setRows] = useState<LeaderboardRow[] | null>(null);

  useEffect(() => {
    api
      .get('/leaderboard')
      .then(({ data }) => setRows(data.data as LeaderboardRow[]))
      .catch(() => setRows([]));
  }, []);

  const myRank = useMemo(() => rows?.find((r) => r.isMe)?.rank, [rows]);

  if (!rows) {
    return (
      <div className="relative min-h-[60vh]">
        <LandingBackdrop />
        <div className="relative z-10 py-20 text-center text-white/60" style={{ fontFamily: 'Cairo' }}>
          جارٍ التحميل…
        </div>
      </div>
    );
  }

  const top3 = rows.slice(0, 3);
  const rest = rows.slice(3);

  return (
    <div className="relative min-h-[80vh]">
      <LandingBackdrop />
      <div className="relative z-10">
        {/* Header */}
        <header className="mb-6 flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl grid place-items-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #FBBF24, #F59E0B, #EF4444)',
              boxShadow: '0 12px 28px rgba(245,158,11,0.35)'
            }}
          >
            <Trophy size={22} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 900, fontSize: 24 }}>
              لوحة المتميّزين
            </h1>
            <p className="text-white/60 mt-0.5" style={{ fontFamily: 'Cairo, sans-serif', fontSize: 13 }}>
              العشرة الأوائل لهذا الأسبوع — تابع تقدّمك واصعد في الترتيب
            </p>
          </div>
          {myRank && (
            <span
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 flex-shrink-0"
              style={{
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 800,
                fontSize: 13,
                background: 'rgba(245,158,11,0.15)',
                color: '#FBBF24',
                border: '1px solid rgba(245,158,11,0.45)'
              }}
            >
              <Sparkles size={13} />
              ترتيبك: #{myRank}
            </span>
          )}
        </header>

        {/* Podium for top 3 */}
        <Podium top3={top3} />

        {/* Ranks 4-10 */}
        <div className="mt-8 flex flex-col gap-2">
          {rest.map((row, i) => (
            <RankRow key={row._id} row={row} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Podium({ top3 }: { top3: LeaderboardRow[] }) {
  // Order on screen: 2nd · 1st · 3rd (left → right) for the classic stage shape.
  const ordered = [top3[1], top3[0], top3[2]].filter(Boolean);
  const heights = [120, 156, 100]; // matches ordered indices: 2nd, 1st, 3rd

  return (
    <div
      className="relative rounded-3xl px-4 sm:px-8 pt-10 pb-4 overflow-hidden"
      style={{
        background:
          'radial-gradient(120% 90% at 50% 0%, rgba(245,158,11,0.18) 0%, rgba(8,4,28,0.0) 60%), linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
        border: '1px solid rgba(245,158,11,0.25)',
        backdropFilter: 'blur(14px)'
      }}
    >
      <div className="grid grid-cols-3 gap-2 sm:gap-6 items-end">
        {ordered.map((row, i) => (
          <PodiumColumn
            key={row._id}
            row={row}
            height={heights[i]}
            place={row.rank}
          />
        ))}
      </div>
    </div>
  );
}

function PodiumColumn({ row, height, place }: { row: LeaderboardRow; height: number; place: number }) {
  const accents: Record<number, { from: string; to: string; medal: string }> = {
    1: { from: '#FBBF24', to: '#F59E0B', medal: '#FACC15' },
    2: { from: '#E5E7EB', to: '#9CA3AF', medal: '#E5E7EB' },
    3: { from: '#F59E0B', to: '#92400E', medal: '#D97706' }
  };
  const a = accents[place] ?? accents[3];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * place, type: 'spring', stiffness: 240, damping: 20 }}
      className="flex flex-col items-center"
    >
      {/* Crown above #1 */}
      {place === 1 && <Crown size={22} className="text-yellow-300 mb-1" fill="#FACC15" />}

      <div
        className="rounded-full grid place-items-center mb-2"
        style={{
          width: place === 1 ? 72 : 60,
          height: place === 1 ? 72 : 60,
          background: `linear-gradient(135deg, ${a.from}, ${a.to})`,
          boxShadow: `0 10px 28px ${a.from}66`,
          border: row.isMe ? '3px solid #FBBF24' : '2px solid rgba(255,255,255,0.25)'
        }}
      >
        <Mascot variant={row.mascotPref} size={place === 1 ? 56 : 46} emotion="excited" />
      </div>

      <span
        className="truncate max-w-full px-1 text-center"
        style={{
          fontFamily: 'Cairo, sans-serif',
          fontWeight: 900,
          fontSize: place === 1 ? 14 : 13,
          color: 'white'
        }}
      >
        {row.isMe ? 'أنت' : row.username}
      </span>

      <span
        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 mt-1"
        style={{
          fontFamily: 'Cairo, sans-serif',
          fontWeight: 800,
          fontSize: 11,
          background: 'rgba(0,0,0,0.4)',
          color: '#FACC15'
        }}
      >
        <Star size={10} fill="#FACC15" />
        {row.xp.toLocaleString('ar-DZ')}
      </span>

      {/* Pillar */}
      <div
        className="w-full mt-3 rounded-t-2xl flex items-center justify-center relative overflow-hidden"
        style={{
          height,
          background: `linear-gradient(180deg, ${a.from} 0%, ${a.to} 100%)`,
          boxShadow: `inset 0 -4px 0 rgba(0,0,0,0.18), 0 14px 30px ${a.from}33`
        }}
      >
        <span
          style={{
            fontFamily: 'Cairo, sans-serif',
            fontWeight: 900,
            fontSize: place === 1 ? 36 : 28,
            color: 'rgba(255,255,255,0.95)',
            textShadow: '0 2px 6px rgba(0,0,0,0.35)'
          }}
        >
          {place}
        </span>
      </div>
    </motion.div>
  );
}

function RankRow({ row, index }: { row: LeaderboardRow; index: number }) {
  const me = row.isMe;
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.04 * index }}
      className="rounded-2xl px-4 py-3 flex items-center gap-3"
      style={{
        background: me
          ? 'linear-gradient(90deg, rgba(245,158,11,0.18) 0%, rgba(245,158,11,0.04) 100%)'
          : 'rgba(255,255,255,0.04)',
        border: me ? '1.5px solid rgba(245,158,11,0.55)' : '1px solid rgba(255,255,255,0.08)',
        boxShadow: me ? '0 10px 26px rgba(245,158,11,0.18)' : 'none'
      }}
    >
      <span
        className="w-9 text-center flex-shrink-0"
        style={{
          fontFamily: 'Cairo, sans-serif',
          fontWeight: 900,
          fontSize: 16,
          color: me ? '#FBBF24' : 'rgba(255,255,255,0.55)'
        }}
      >
        #{row.rank}
      </span>

      <div
        className="rounded-full grid place-items-center flex-shrink-0"
        style={{
          width: 40,
          height: 40,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)'
        }}
      >
        <Mascot variant={row.mascotPref} size={32} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className="truncate"
            style={{
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 800,
              fontSize: 14,
              color: 'white'
            }}
          >
            {me ? 'أنت' : row.username}
          </span>
          {me && (
            <span
              className="rounded-full px-2 py-0.5 text-[10px] flex-shrink-0"
              style={{
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #FBBF24, #F59E0B, #EF4444)',
                color: 'white'
              }}
            >
              ترتيبك
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span
            className="inline-flex items-center gap-1 text-[11px]"
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}
          >
            <Flame size={11} className="text-orange-400" />
            {row.streak}
          </span>
        </div>
      </div>

      <span
        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 flex-shrink-0"
        style={{
          fontFamily: 'Cairo, sans-serif',
          fontWeight: 900,
          fontSize: 12,
          background: 'rgba(0,0,0,0.4)',
          color: '#FACC15',
          border: '1px solid rgba(250,204,21,0.25)'
        }}
      >
        <Star size={11} fill="#FACC15" />
        {row.xp.toLocaleString('ar-DZ')}
      </span>
    </motion.div>
  );
}
