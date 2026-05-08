import React from 'react';
import { motion } from 'motion/react';
import { Lock, Sparkles } from 'lucide-react';
import type { CourseTopic, MascotPref } from '@/lib/types';

import mascotBlue from '@/assets/mascot_blue.svg';
import mascotBlueExcited from '@/assets/mascot_blue_excited.svg';
import mascotBlueThinking from '@/assets/mascot_blue_thinking.svg';
import mascotBlueCelebrating from '@/assets/mascot_blue_celebrating.svg';
import mascotPink from '@/assets/mascot_pink.svg';
import mascotPinkExcited from '@/assets/mascot_pink_excited.svg';
import mascotPinkThinking from '@/assets/mascot_pink_thinking.svg';
import mascotPinkCelebrating from '@/assets/mascot_pink_celebrating.svg';

// Includes the locked "islamic studies" card we surface as a teaser on the dashboard.
export type DashboardTopic = CourseTopic | 'islamic';

interface PlanetPalette {
  color: string;
  colorDark: string;
  colorLight: string;
  glow: string;
  ringColor: string;
  craterColor: string;
}

const PALETTE: Record<DashboardTopic, PlanetPalette> = {
  history: {
    color: '#f97316',
    colorDark: '#7c2d12',
    colorLight: '#fdba74',
    glow: 'rgba(249,115,22,0.55)',
    ringColor: 'rgba(249,115,22,0.4)',
    craterColor: 'rgba(124,45,18,0.45)'
  },
  math: {
    color: '#38bdf8',
    colorDark: '#0c4a6e',
    colorLight: '#bae6fd',
    glow: 'rgba(56,189,248,0.5)',
    ringColor: 'rgba(56,189,248,0.4)',
    craterColor: 'rgba(12,74,110,0.45)'
  },
  coding: {
    color: '#34d399',
    colorDark: '#065f46',
    colorLight: '#a7f3d0',
    glow: 'rgba(52,211,153,0.5)',
    ringColor: 'rgba(52,211,153,0.4)',
    craterColor: 'rgba(6,95,70,0.45)'
  },
  islamic: {
    color: '#a78bfa',
    colorDark: '#4c1d95',
    colorLight: '#ddd6fe',
    glow: 'rgba(167,139,250,0.5)',
    ringColor: 'rgba(167,139,250,0.4)',
    craterColor: 'rgba(76,29,149,0.45)'
  }
};

const FLOAT_DELAY: Record<DashboardTopic, number> = {
  history: 0.4,
  math: 0,
  coding: 0.8,
  islamic: 1.2
};

// Per-topic mascot artwork — one drawing per (topic × avatar choice).
// Mapping confirmed by product owner.
const MASCOT_BY_TOPIC: Record<DashboardTopic, Record<MascotPref, string>> = {
  history: { blue: mascotBlueCelebrating, pink: mascotPinkCelebrating },
  math: { blue: mascotBlue, pink: mascotPinkExcited },
  coding: { blue: mascotBlueExcited, pink: mascotPink },
  islamic: { blue: mascotBlueThinking, pink: mascotPinkThinking }
};

interface PlanetCardProps {
  topic: DashboardTopic;
  titleAr: string;
  done: number;
  total: number;
  onStart: () => void;
  onSelect?: () => void;
  selected?: boolean;
  startLabel?: string;
  mascotPref: MascotPref;
  /** Renders the card as a teaser with a lock + "more coming soon" message. */
  locked?: boolean;
}

export function PlanetCard({
  topic,
  titleAr,
  done,
  total,
  onStart,
  onSelect,
  selected,
  startLabel = 'ابدأ',
  mascotPref,
  locked = false
}: PlanetCardProps) {
  const palette = PALETTE[topic];
  const pct = total ? Math.round((done / total) * 100) : 0;
  const mascotSrc = MASCOT_BY_TOPIC[topic][mascotPref];
  const delay = FLOAT_DELAY[topic];

  return (
    <motion.button
      onClick={locked ? undefined : onSelect}
      whileHover={locked ? undefined : { y: -4 }}
      disabled={locked}
      className="relative rounded-3xl p-6 text-start group w-full"
      style={{
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
        border: `1.5px solid ${selected && !locked ? palette.color : 'rgba(255,255,255,0.08)'}`,
        boxShadow:
          selected && !locked
            ? `0 24px 80px rgba(0,0,0,0.4), 0 0 60px ${palette.glow}, inset 0 1px 0 rgba(255,255,255,0.18)`
            : '0 24px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.10)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        cursor: locked ? 'not-allowed' : 'pointer'
      }}
    >
      {/* Floating mascot centered */}
      <div className="flex items-center justify-center mb-5 relative" style={{ height: 150 }}>
        {/* radial glow behind the mascot */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${palette.glow} 0%, transparent 65%)`,
            filter: 'blur(24px)',
            opacity: locked ? 0.35 : 0.85
          }}
        />
        <motion.img
          src={mascotSrc}
          alt=""
          aria-hidden
          draggable={false}
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 3 + delay * 0.4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay
          }}
          style={{
            width: 140,
            height: 140,
            objectFit: 'contain',
            filter: locked
              ? `grayscale(0.55) drop-shadow(0 14px 28px rgba(0,0,0,0.45))`
              : `drop-shadow(0 16px 36px ${palette.glow})`,
            opacity: locked ? 0.7 : 1,
            userSelect: 'none',
            pointerEvents: 'none'
          }}
        />

        {/* Lock badge for the teaser card */}
        {locked && (
          <span
            aria-hidden
            className="absolute rounded-full grid place-items-center"
            style={{
              top: 6,
              insetInlineEnd: 6,
              width: 40,
              height: 40,
              background: 'linear-gradient(135deg, rgba(167,139,250,0.95), rgba(76,29,149,0.95))',
              border: '2px solid rgba(255,255,255,0.18)',
              boxShadow: '0 8px 22px rgba(76,29,149,0.5)'
            }}
          >
            <Lock size={18} className="text-white" />
          </span>
        )}
      </div>

      <div className="text-center">
        <h3
          style={{
            fontFamily: 'Cairo, sans-serif',
            fontWeight: 900,
            fontSize: 22,
            color: 'white',
            textShadow: `0 0 18px ${palette.glow}`,
            opacity: locked ? 0.85 : 1
          }}
        >
          {titleAr}
        </h3>
        {locked ? (
          <p
            className="mt-1 inline-flex items-center gap-1.5 justify-center"
            style={{ fontFamily: 'Cairo, sans-serif', fontSize: 13, color: palette.colorLight }}
          >
            <Sparkles size={13} />
            more is coming soon
          </p>
        ) : (
          <p
            className="mt-1"
            style={{ fontFamily: 'Cairo, sans-serif', fontSize: 13, color: palette.colorLight }}
          >
            {done}/{total} درس
          </p>
        )}
      </div>

      <div className="mt-4 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          animate={{ width: locked ? '0%' : `${pct}%` }}
          transition={{ duration: 0.6 }}
          style={{
            background: `linear-gradient(90deg, ${palette.color}, ${palette.colorLight})`
          }}
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span style={{ fontFamily: 'Cairo', fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
          {locked ? '—' : `${pct}%`}
        </span>
        {locked ? (
          <span
            className="rounded-full px-4 py-1.5 text-sm inline-flex items-center gap-1.5"
            style={{
              background: 'rgba(167,139,250,0.18)',
              border: '1px solid rgba(167,139,250,0.45)',
              color: '#DDD6FE',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 800
            }}
          >
            <Lock size={12} />
            قريباً
          </span>
        ) : (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onStart();
            }}
            className="rounded-full px-4 py-1.5 text-sm cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${palette.color}, ${palette.colorDark})`,
              color: 'white',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 800,
              boxShadow: `0 8px 22px ${palette.glow}`
            }}
          >
            {startLabel} ←
          </span>
        )}
      </div>
    </motion.button>
  );
}
