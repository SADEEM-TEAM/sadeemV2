import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Lock,
  Check,
  Star,
  BookOpen,
  Brain,
  Sparkles,
  Compass,
  Lightbulb,
  Trophy,
  Crown
} from 'lucide-react';

import type { RoadmapLesson } from '@/lib/types';

const NODE_ICONS = [Star, BookOpen, Brain, Sparkles, Compass, Lightbulb] as const;

// 8-step zigzag wave the path cycles through. In px, applied as translateX.
const OFFSETS = [0, -56, -78, -56, 0, 56, 78, 56];
const OFFSETS_SM = [0, -34, -50, -34, 0, 34, 50, 34];

export type LessonPathSize = 'sm' | 'md';

interface LessonPathProps {
  lessons: RoadmapLesson[];
  accent: string;
  onPick: (id: string) => void;
  size?: LessonPathSize;
}

export function LessonPath({ lessons, accent, onPick, size = 'md' }: LessonPathProps) {
  // The active node = first unlocked, not completed lesson. Used to surface the
  // floating "ابدأ" tag that mirrors Duolingo's START marker.
  const activeIdx = useMemo(
    () => lessons.findIndex((l) => l.status !== 'completed' && l.status !== 'locked'),
    [lessons]
  );

  const offsets = size === 'sm' ? OFFSETS_SM : OFFSETS;
  const gap = size === 'sm' ? 18 : 28;
  const dim = size === 'sm' ? 60 : 80;

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ gap, paddingTop: size === 'sm' ? 30 : 44, paddingBottom: 12 }}
    >
      {lessons.map((lesson, i) => {
        const offset = offsets[i % offsets.length];
        const prevOffset = i > 0 ? offsets[(i - 1) % offsets.length] : offset;
        const isActive = i === activeIdx;
        const isLastCompleted =
          i === lessons.length - 1 && lessons.every((l) => l.status === 'completed');
        return (
          <PathNode
            key={lesson._id}
            lesson={lesson}
            accent={accent}
            offset={offset}
            prevOffset={prevOffset}
            isActive={isActive}
            isFinale={isLastCompleted}
            onPick={onPick}
            idx={i}
            size={size}
            dim={dim}
            gap={gap}
          />
        );
      })}
    </div>
  );
}

interface PathNodeProps {
  lesson: RoadmapLesson;
  accent: string;
  offset: number;
  prevOffset: number;
  isActive: boolean;
  isFinale: boolean;
  onPick: (id: string) => void;
  idx: number;
  size: LessonPathSize;
  dim: number;
  gap: number;
}

function PathNode({ lesson, accent, offset, prevOffset, isActive, isFinale, onPick, idx, size, dim, gap }: PathNodeProps) {
  const locked = lesson.status === 'locked';
  const completed = lesson.status === 'completed';
  const Icon = isFinale
    ? Trophy
    : completed
    ? Check
    : locked
    ? Lock
    : NODE_ICONS[idx % NODE_ICONS.length];

  // Color tokens
  const ring = locked
    ? 'rgba(255,255,255,0.12)'
    : completed
    ? accent
    : isActive
    ? '#FBBF24'
    : `${accent}88`;
  const bg = locked
    ? 'rgba(255,255,255,0.04)'
    : completed
    ? `linear-gradient(135deg, ${accent}, ${accent}aa)`
    : isActive
    ? 'linear-gradient(135deg, #FBBF24, #F59E0B, #EF4444)'
    : `linear-gradient(135deg, ${accent}55, ${accent}22)`;
  const shadow = locked
    ? 'none'
    : isActive
    ? '0 14px 40px rgba(245,158,11,0.55), inset 0 -4px 0 rgba(0,0,0,0.18)'
    : completed
    ? `0 12px 30px ${accent}55, inset 0 -4px 0 rgba(0,0,0,0.20)`
    : `0 8px 24px rgba(0,0,0,0.45), inset 0 -3px 0 rgba(0,0,0,0.22)`;
  const iconColor = locked ? 'rgba(255,255,255,0.35)' : 'white';

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ transform: `translateX(${offset}px)` }}
    >
      {/* Thick gold "footstep" trail connecting from the previous node into this one. */}
      {idx > 0 && <FootstepTrail dx={prevOffset - offset} gap={gap} size={size} dim={dim} />}

      {/* Floating "ابدأ" tag above the active node */}
      {isActive && !locked && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-10 rounded-full px-3 py-1 inline-flex items-center gap-1"
          style={{
            top: -32,
            background: 'linear-gradient(135deg, #FBBF24, #F59E0B, #EF4444)',
            boxShadow: '0 10px 24px rgba(245,158,11,0.55)',
            fontFamily: 'Cairo, sans-serif',
            fontWeight: 900,
            fontSize: 11,
            color: 'white',
            letterSpacing: 0.5
          }}
        >
          <Sparkles size={11} />
          ابدأ
          {/* tail */}
          <span
            aria-hidden
            className="absolute"
            style={{
              left: '50%',
              bottom: -5,
              transform: 'translateX(-50%) rotate(45deg)',
              width: 10,
              height: 10,
              background: 'linear-gradient(135deg, #F59E0B, #EF4444)'
            }}
          />
        </motion.div>
      )}

      {/* Pulsing ring for active node */}
      {isActive && !locked && (
        <motion.span
          aria-hidden
          className="absolute rounded-full pointer-events-none"
          animate={{ scale: [1, 1.18, 1], opacity: [0.55, 0, 0.55] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: dim + 16,
            height: dim + 16,
            border: '2px solid #FBBF24',
            boxShadow: '0 0 32px rgba(251,191,36,0.55)'
          }}
        />
      )}

      <motion.button
        whileHover={!locked ? { scale: 1.06, y: -2 } : {}}
        whileTap={!locked ? { scale: 0.94 } : {}}
        disabled={locked}
        onClick={() => !locked && onPick(lesson._id)}
        className="relative rounded-full grid place-items-center"
        style={{
          width: dim,
          height: dim,
          background: bg,
          border: `3px solid ${ring}`,
          boxShadow: shadow,
          cursor: locked ? 'not-allowed' : 'pointer',
          transition: 'transform 220ms'
        }}
      >
        <Icon size={size === 'sm' ? 22 : 30} color={iconColor} strokeWidth={2.4} />
        {/* small XP sticker on hover for active/completed only */}
        {!locked && size === 'md' && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 * idx }}
            className="absolute"
            style={{
              top: -8,
              insetInlineEnd: -8,
              fontSize: 10,
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 900,
              color: '#FACC15',
              background: 'rgba(0,0,0,0.55)',
              border: '1px solid rgba(250,204,21,0.45)',
              borderRadius: 999,
              padding: '2px 6px',
              lineHeight: 1
            }}
          >
            +{lesson.xpReward}
          </motion.span>
        )}
      </motion.button>

      {/* Title chip below — only the active node carries its name (matches dashboard preview cleanliness). */}
      {size === 'md' && isActive && !locked && (
        <p
          className="text-center mt-2 max-w-[200px]"
          style={{
            fontFamily: 'Cairo, sans-serif',
            fontWeight: 800,
            fontSize: 13,
            color: 'rgba(255,255,255,0.92)',
            lineHeight: 1.35,
            textShadow: '0 2px 8px rgba(0,0,0,0.6)'
          }}
        >
          {lesson.titleAr}
        </p>
      )}
    </div>
  );
}

// Thick gold "footsteps" trail connecting two nodes vertically.
// Drawn in the flex gap *above* a node, going from the previous node's column
// (top of trail at x = dx) down into this node (bottom of trail at x = 0).
// Two stacked SVG strokes (wide soft glow + thin bright dashes) read as a
// stitched/footprint line at any size.
function FootstepTrail({ dx, gap, size, dim }: { dx: number; gap: number; size: LessonPathSize; dim: number }) {
  // Trail spans the visible gap PLUS a bit into both buttons so the dashes
  // appear to come out of and enter the node circles cleanly.
  const overlap = Math.round(dim * 0.18);
  const h = gap + overlap * 2;
  const padX = 32;
  const w = Math.abs(dx) + padX * 2;

  // Inside our viewBox, the bottom of the trail lands at the *top of this node's circle*.
  // y=0 is the topmost trail point (above the previous node's center area),
  // y=h is the bottom (just below this node's top edge).
  const topY = 0;
  const bottomY = h;
  const topX = dx;
  const bottomX = 0;

  const dashGlow = size === 'sm' ? '2 11' : '3 15';
  const dashCore = size === 'sm' ? '2 11' : '3 15';
  const glowWidth = size === 'sm' ? 9 : 12;
  const coreWidth = size === 'sm' ? 4 : 6;

  return (
    <svg
      aria-hidden
      width={w}
      height={h}
      viewBox={`${-w / 2} 0 ${w} ${h}`}
      style={{
        position: 'absolute',
        // The top of the SVG sits `gap + overlap` above the current node's top edge,
        // i.e. its bottom dips `overlap` into this node's circle. Same on the prev side.
        top: -(gap + overlap),
        left: `calc(50% - ${w / 2}px)`,
        pointerEvents: 'none',
        overflow: 'visible',
        zIndex: 0
      }}
    >
      {/* Soft amber glow — gives the trail its "thick gold" body */}
      <path
        d={`M ${topX} ${topY} L ${bottomX} ${bottomY}`}
        stroke="#F59E0B"
        strokeWidth={glowWidth}
        strokeLinecap="round"
        strokeDasharray={dashGlow}
        fill="none"
        opacity={0.45}
      />
      {/* Bright core dashes — the actual "footsteps" */}
      <path
        d={`M ${topX} ${topY} L ${bottomX} ${bottomY}`}
        stroke="#FBBF24"
        strokeWidth={coreWidth}
        strokeLinecap="round"
        strokeDasharray={dashCore}
        fill="none"
        opacity={0.95}
      />
    </svg>
  );
}

// Slim Duolingo-style "unit" banner for a level. Single row: hexagon badge → title → [diff, count, crown] → thin progress.
export function LevelBanner({
  level,
  nameAr,
  difficulty,
  accent,
  pct,
  completed,
  total,
  gateOpen
}: {
  level: number;
  nameAr: string;
  difficulty?: string;
  accent: string;
  pct: number;
  completed: number;
  total: number;
  gateOpen: boolean;
}) {
  const DIFF: Record<string, { label: string; color: string }> = {
    easy: { label: 'سهل', color: '#34D399' },
    medium: { label: 'متوسّط', color: '#FBBF24' },
    medium_hard: { label: 'صعب نسبياً', color: '#FB923C' },
    hard: { label: 'صعب', color: '#F43F5E' }
  };
  const diff = difficulty ? DIFF[difficulty] : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative rounded-full px-4 py-2.5 mb-1"
      style={{
        background: gateOpen
          ? `linear-gradient(90deg, ${accent}26 0%, rgba(255,255,255,0.04) 100%)`
          : 'rgba(255,255,255,0.04)',
        border: `1px solid ${gateOpen ? `${accent}55` : 'rgba(255,255,255,0.08)'}`,
        backdropFilter: 'blur(14px)',
        boxShadow: gateOpen ? `0 12px 32px ${accent}1f` : 'none'
      }}
    >
      <div className="flex items-center gap-3">
        {/* Hexagon level badge */}
        <HexagonBadge level={level} gateOpen={gateOpen} />

        {/* Title takes the available space */}
        <h2
          className="flex-1 truncate"
          style={{
            fontFamily: 'Cairo, sans-serif',
            fontWeight: 900,
            fontSize: 16,
            color: gateOpen ? 'white' : 'rgba(255,255,255,0.55)',
            textShadow: '0 2px 8px rgba(0,0,0,0.45)'
          }}
        >
          {nameAr}
        </h2>

        {/* Right-side stats — pinned order: [difficulty pill] [count] [crown] */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {diff && (
            <span
              className="rounded-full px-2.5 py-0.5 text-[11px]"
              style={{
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 800,
                background: `${diff.color}22`,
                color: diff.color,
                border: `1px solid ${diff.color}55`,
                lineHeight: 1.6
              }}
            >
              {diff.label}
            </span>
          )}
          <span
            style={{
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 800,
              fontSize: 12,
              color: gateOpen ? '#FACC15' : 'rgba(255,255,255,0.4)',
              minWidth: 28,
              textAlign: 'center'
            }}
          >
            {completed}/{total}
          </span>
          {pct === 100 && <Crown size={14} className="text-yellow-300" />}
        </div>
      </div>

      {/* Hairline progress bar with the 60% gate tick — keeps the unlock signal visible */}
      <div className="mt-2 relative h-[3px] rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          animate={{ width: `${pct}%` }}
          style={{ background: `linear-gradient(90deg, ${accent}, ${accent}aa)` }}
        />
        <div
          className="absolute top-0 bottom-0 w-px"
          style={{ left: '60%', background: pct >= 60 ? '#34D399' : 'rgba(255,255,255,0.30)' }}
        />
      </div>
    </motion.div>
  );
}

function HexagonBadge({ level, gateOpen }: { level: number; gateOpen: boolean }) {
  const fill = gateOpen
    ? 'linear-gradient(135deg, #FBBF24, #F59E0B, #EF4444)'
    : 'rgba(255,255,255,0.08)';
  return (
    <div
      className="relative flex-shrink-0 grid place-items-center"
      style={{
        width: 38,
        height: 38,
        background: fill,
        clipPath: 'polygon(50% 2%, 96% 26%, 96% 74%, 50% 98%, 4% 74%, 4% 26%)',
        boxShadow: gateOpen ? '0 8px 22px rgba(245,158,11,0.45)' : 'none'
      }}
    >
      {/* inner hex outline */}
      <span
        aria-hidden
        className="absolute inset-1"
        style={{
          background: gateOpen ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.05)',
          clipPath: 'polygon(50% 2%, 96% 26%, 96% 74%, 50% 98%, 4% 74%, 4% 26%)'
        }}
      />
      <span
        aria-hidden
        className="absolute inset-[3px]"
        style={{
          background: fill,
          clipPath: 'polygon(50% 2%, 96% 26%, 96% 74%, 50% 98%, 4% 74%, 4% 26%)'
        }}
      />
      {gateOpen ? (
        <span
          className="relative"
          style={{
            fontFamily: 'Cairo, sans-serif',
            fontWeight: 900,
            color: 'white',
            fontSize: 15,
            textShadow: '0 1px 2px rgba(0,0,0,0.35)'
          }}
        >
          {level}
        </span>
      ) : (
        <Lock size={14} className="relative text-white/55" />
      )}
    </div>
  );
}
