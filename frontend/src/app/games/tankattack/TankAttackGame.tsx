import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Star, Skull, RotateCcw, ArrowLeft, Keyboard, Hand } from 'lucide-react';

import type { GamePluginProps } from '../_types';
import { PrimaryButton } from '../../components/ui/PrimaryButton';

// ─── Constants ────────────────────────────────────────────────────────────────
// Logical playfield size — the whole game is rendered at these dimensions and
// CSS-scaled to fit the available container width. All x/y math stays in this
// fixed space so animation and collision are framerate-stable.
const GAME_W = 720;
const GAME_H = 520;
const PLAYER_X = GAME_W / 2;
const PLAYER_Y = GAME_H - 70;
const HITBOX = 50;
const TANK_SIZE = 56;
const DEFAULT_TARGET_WAVES = 5;

interface Question {
  questionAr: string;
  correctAr: string;
  wrongAr: string[];
}

interface Enemy {
  id: string;
  number: number;
  answer: string;
  isCorrect: boolean;
  x: number;
  y: number;
  speed: number;
}

interface Explosion {
  id: string;
  x: number;
  y: number;
  big: boolean;
}

type Phase = 'intro' | 'countdown' | 'playing' | 'won' | 'lost';

// Last-resort questions, only used if the lesson pack ships an empty payload.
const FALLBACK_QUESTIONS: Question[] = [
  { questionAr: 'كم تساوي 5 + 7 ؟', correctAr: '12', wrongAr: ['10', '11', '13', '14', '15'] }
];

// ─── Utils ────────────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateWave(waveNum: number, questions: Question[]): { question: string; enemies: Enemy[] } {
  // Wave 1 → 3 enemies, ramp to 7. Cap at 9 so number keys 1-9 all stay valid.
  const numEnemies = Math.min(3 + Math.floor((waveNum - 1) / 2), 7);
  const q = questions[Math.floor(Math.random() * questions.length)];
  const wrongPool = shuffle(q.wrongAr);
  const correctIdx = Math.floor(Math.random() * numEnemies);

  const margin = 60;
  const usableW = GAME_W - 2 * margin;
  const positions: number[] = [];
  for (let i = 0; i < numEnemies; i++) {
    const baseX = margin + (i + 0.5) * (usableW / numEnemies);
    const jitter = (Math.random() - 0.5) * (usableW / numEnemies) * 0.4;
    positions.push(baseX + jitter);
  }
  const shuffledPos = shuffle(positions);
  const baseSpeed = 0.32 + (waveNum - 1) * 0.045;

  let wrongIdx = 0;
  const enemies: Enemy[] = [];
  for (let i = 0; i < numEnemies; i++) {
    const isCorrect = i === correctIdx;
    const answer = isCorrect ? q.correctAr : wrongPool[wrongIdx++ % wrongPool.length];
    enemies.push({
      id: `e-${waveNum}-${i}-${Math.random().toString(36).slice(2, 7)}`,
      number: i + 1,
      answer,
      isCorrect,
      x: shuffledPos[i],
      y: -50 - Math.random() * 240,
      speed: baseSpeed + Math.random() * 0.22
    });
  }
  return { question: q.questionAr, enemies };
}

// ─── Tank visuals ─────────────────────────────────────────────────────────────
function PlayerTankSVG({ accent }: { accent: string }) {
  return (
    <svg width={TANK_SIZE} height={TANK_SIZE} viewBox="0 0 60 60">
      <rect x="3" y="11" width="9" height="40" fill="#0f172a" rx="2" />
      <rect x="48" y="11" width="9" height="40" fill="#0f172a" rx="2" />
      {[14, 21, 28, 35, 42, 48].map((y) => (
        <g key={y}>
          <rect x="3" y={y} width="9" height="1.5" fill="#475569" />
          <rect x="48" y={y} width="9" height="1.5" fill="#475569" />
        </g>
      ))}
      <rect x="11" y="16" width="38" height="30" fill={accent} rx="3" stroke="#0c4a6e" strokeWidth="1.5" />
      <rect x="14" y="19" width="32" height="3" fill="rgba(255,255,255,0.6)" rx="1" />
      <circle cx="30" cy="32" r="11" fill={accent} stroke="#0c4a6e" strokeWidth="1.5" />
      <circle cx="30" cy="32" r="4" fill="#0c4a6e" />
      <rect x="28.5" y="0" width="3" height="24" fill="#0c4a6e" />
      <rect x="27" y="-1" width="6" height="3" fill="#0c4a6e" />
    </svg>
  );
}

function EnemyTankSVG({ pending }: { pending: boolean }) {
  return (
    <svg width={TANK_SIZE} height={TANK_SIZE} viewBox="0 0 60 60" style={{ transform: 'rotate(180deg)' }}>
      <rect x="3" y="11" width="9" height="40" fill="#0f172a" rx="2" />
      <rect x="48" y="11" width="9" height="40" fill="#0f172a" rx="2" />
      {[14, 21, 28, 35, 42, 48].map((y) => (
        <g key={y}>
          <rect x="3" y={y} width="9" height="1.5" fill="#475569" />
          <rect x="48" y={y} width="9" height="1.5" fill="#475569" />
        </g>
      ))}
      <rect
        x="11"
        y="16"
        width="38"
        height="30"
        fill={pending ? '#FBBF24' : '#dc2626'}
        rx="3"
        stroke={pending ? '#78350f' : '#7f1d1d'}
        strokeWidth="1.5"
      />
      <rect x="14" y="19" width="32" height="3" fill="rgba(255,255,255,0.6)" rx="1" />
      <circle
        cx="30"
        cy="32"
        r="11"
        fill={pending ? '#F59E0B' : '#b91c1c'}
        stroke={pending ? '#78350f' : '#7f1d1d'}
        strokeWidth="1.5"
      />
      <circle cx="30" cy="32" r="4" fill={pending ? '#78350f' : '#450a0a'} />
      <rect x="28.5" y="0" width="3" height="24" fill={pending ? '#78350f' : '#7f1d1d'} />
      <rect x="27" y="-1" width="6" height="3" fill={pending ? '#78350f' : '#7f1d1d'} />
    </svg>
  );
}

// ─── Decorative star field for the playfield ────────────────────────────────
function Stars() {
  // Pre-baked positions so the field is stable across renders.
  const stars = useMemo(
    () =>
      Array.from({ length: 35 }).map((_, i) => ({
        x: (i * 73 + 13) % GAME_W,
        y: (i * 41 + 7) % (GAME_H - 80),
        s: 0.6 + ((i * 17) % 18) / 18,
        op: 0.25 + ((i * 13) % 60) / 100
      })),
    []
  );
  return (
    <>
      {stars.map((st, i) => (
        <span
          key={i}
          aria-hidden
          className="absolute rounded-full"
          style={{
            left: st.x,
            top: st.y,
            width: 2 * st.s,
            height: 2 * st.s,
            background: 'white',
            opacity: st.op,
            boxShadow: '0 0 4px rgba(255,255,255,0.6)',
            pointerEvents: 'none'
          }}
        />
      ))}
    </>
  );
}

// ─── HUD ─────────────────────────────────────────────────────────────────────
function HUD({
  wave,
  targetWaves,
  score,
  wrongCount,
  accent
}: {
  wave: number;
  targetWaves: number;
  score: number;
  wrongCount: number;
  accent: string;
}) {
  const penaltyActive = wrongCount >= 3;
  return (
    <>
      {/* Top-left: wave + score */}
      <div
        className="absolute z-20 rounded-2xl px-3 py-2"
        style={{
          top: 12,
          left: 12,
          background: 'rgba(8,4,28,0.85)',
          border: `1px solid ${accent}55`,
          backdropFilter: 'blur(10px)',
          fontFamily: 'Cairo, sans-serif',
          color: 'white',
          minWidth: 92,
          direction: 'rtl'
        }}
      >
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontWeight: 700 }}>الموجة</div>
        <div style={{ fontSize: 22, color: accent, fontWeight: 900, lineHeight: 1.1 }}>
          {wave}
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 700 }}>
            {' '}
            / {targetWaves}
          </span>
        </div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontWeight: 700, marginTop: 4 }}>
          النقاط
        </div>
        <div style={{ fontSize: 14, color: '#FACC15', fontWeight: 800 }}>{score}</div>
      </div>

      {/* Top-right: errors */}
      <div
        className="absolute z-20 rounded-2xl px-3 py-2"
        style={{
          top: 12,
          right: 12,
          background: 'rgba(8,4,28,0.85)',
          border: '1px solid rgba(255,255,255,0.10)',
          backdropFilter: 'blur(10px)',
          fontFamily: 'Cairo, sans-serif',
          color: 'white',
          minWidth: 110,
          textAlign: 'right',
          direction: 'rtl'
        }}
      >
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontWeight: 700 }}>الأخطاء</div>
        <div className="flex justify-end gap-1 mt-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="rounded-full"
              style={{
                width: 10,
                height: 10,
                background: wrongCount > i ? '#EF4444' : 'rgba(255,255,255,0.10)',
                border: `1px solid ${wrongCount > i ? '#FCA5A5' : 'rgba(255,255,255,0.25)'}`
              }}
            />
          ))}
        </div>
        {penaltyActive ? (
          <div
            className="tank-pulse"
            style={{ fontSize: 10, color: '#FCA5A5', fontWeight: 800, marginTop: 5 }}
          >
            ⚠ عقوبة × ٢
          </div>
        ) : (
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginTop: 5 }}>
            {3 - wrongCount} قبل العقوبة
          </div>
        )}
      </div>
    </>
  );
}

// ─── Enemy view ──────────────────────────────────────────────────────────────
function EnemyView({
  enemy,
  pending,
  onClick
}: {
  enemy: Enemy;
  pending: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className="absolute"
      style={{
        left: enemy.x - TANK_SIZE / 2,
        top: enemy.y - TANK_SIZE / 2,
        zIndex: 10
      }}
    >
      {/* Answer bubble — RTL Arabic text, sits above the tank */}
      <div
        className="absolute left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg whitespace-nowrap"
        style={{
          top: -32,
          background: pending ? 'rgba(254, 243, 199, 0.97)' : 'rgba(8,4,28,0.92)',
          color: pending ? '#78350f' : '#FECACA',
          border: `1.5px solid ${pending ? '#F59E0B' : '#7F1D1D'}`,
          boxShadow: '0 8px 18px rgba(0,0,0,0.4)',
          fontFamily: 'Cairo, sans-serif',
          fontWeight: 800,
          fontSize: 12,
          direction: 'rtl'
        }}
      >
        {enemy.answer}
      </div>

      {/* Tank — clickable for touch users */}
      <button
        onClick={onClick}
        className={pending ? 'tank-pulse-ring rounded-full' : ''}
        style={{
          padding: 0,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          width: TANK_SIZE,
          height: TANK_SIZE,
          display: 'block'
        }}
        aria-label={`الدبابة رقم ${enemy.number}`}
      >
        <EnemyTankSVG pending={pending} />
      </button>

      {/* Number badge */}
      <span
        className="absolute pointer-events-none"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: pending ? '#FCD34D' : '#0f172a',
          color: pending ? '#451a03' : 'white',
          display: 'grid',
          placeItems: 'center',
          fontFamily: 'Cairo, sans-serif',
          fontWeight: 900,
          fontSize: 14,
          boxShadow: pending
            ? '0 0 0 2px #FEF3C7, 0 6px 14px rgba(0,0,0,0.35)'
            : '0 0 0 2px rgba(255,255,255,0.95), 0 6px 14px rgba(0,0,0,0.35)'
        }}
      >
        {enemy.number}
      </span>
    </div>
  );
}

// ─── Overlays (intro / countdown / result) ───────────────────────────────────
function IntroScreen({
  onStart,
  accent,
  targetWaves
}: {
  onStart: () => void;
  accent: string;
  targetWaves: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6"
      style={{
        background:
          'radial-gradient(ellipse at center, rgba(8,4,28,0.82) 0%, rgba(8,4,28,0.96) 80%)',
        backdropFilter: 'blur(8px)',
        direction: 'rtl'
      }}
    >
      <div
        className="rounded-3xl grid place-items-center mb-3"
        style={{
          width: 72,
          height: 72,
          background: `linear-gradient(135deg, ${accent}, ${accent}aa)`,
          boxShadow: `0 14px 36px ${accent}66`
        }}
      >
        <span style={{ fontSize: 36 }}>🛡️</span>
      </div>
      <h2
        className="text-white text-center"
        style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 900, fontSize: 26, marginBottom: 6 }}
      >
        معركة الدبابات
      </h2>
      <p
        className="text-white/70 text-center max-w-[460px]"
        style={{ fontFamily: 'Cairo, sans-serif', fontSize: 14, lineHeight: 1.7 }}
      >
        اقرأ السؤال، ثمّ دمّر الدبّابة التي تحمل الإجابة الصحيحة.
        <br />
        انجُ من <strong style={{ color: accent }}>{targetWaves}</strong> موجات للفوز!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-5 w-full max-w-[460px]">
        <RuleRow color="#EF4444" icon="⚠">
          <strong>٣ أخطاء</strong> ⟵ الإجابة التالية تحتاج <strong>ضربتَين</strong>
        </RuleRow>
        <RuleRow color="#EF4444" icon="💀">
          إذا لمستك دبّابة ⟵ <strong>خسارة</strong>
        </RuleRow>
        <RuleRow color="#FACC15" icon="🎯">
          الإجابة الصحيحة ⟵ <strong>+١٠٠ نقطة</strong> ومكافأة موجة
        </RuleRow>
        <RuleRow color={accent} icon={<Hand size={13} />}>
          المسي الدبّابة أو اضغط <strong>1-9</strong>
        </RuleRow>
      </div>

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={onStart}
        className="rounded-full px-8 py-3 mt-6"
        style={{
          fontFamily: 'Cairo, sans-serif',
          fontWeight: 900,
          fontSize: 16,
          color: 'white',
          background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
          boxShadow: `0 14px 36px ${accent}66`,
          border: 'none',
          cursor: 'pointer'
        }}
      >
        ابدأ المعركة ⚔
      </motion.button>
    </motion.div>
  );
}

function RuleRow({
  color,
  icon,
  children
}: {
  color: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl px-3 py-2 flex items-start gap-2"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${color}33`,
        fontFamily: 'Cairo, sans-serif',
        fontSize: 12.5,
        color: 'rgba(255,255,255,0.85)',
        lineHeight: 1.55
      }}
    >
      <span style={{ color, flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <span>{children}</span>
    </div>
  );
}

function Countdown({ n, accent }: { n: number; accent: string }) {
  return (
    <motion.div
      key={n}
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1.1, opacity: 1 }}
      exit={{ scale: 1.6, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 240, damping: 16 }}
      className="absolute inset-0 z-30 grid place-items-center pointer-events-none"
      style={{ background: 'rgba(8,4,28,0.4)', backdropFilter: 'blur(2px)' }}
    >
      <span
        style={{
          fontFamily: 'Cairo, sans-serif',
          fontWeight: 900,
          fontSize: 120,
          color: accent,
          textShadow: `0 0 40px ${accent}99, 0 0 80px ${accent}55`
        }}
      >
        {n}
      </span>
    </motion.div>
  );
}

function ResultScreen({
  kind,
  wave,
  score,
  onRetry,
  onContinue,
  accent,
  busy
}: {
  kind: 'won' | 'lost';
  wave: number;
  score: number;
  onRetry?: () => void;
  onContinue: () => void;
  accent: string;
  busy: boolean;
}) {
  const won = kind === 'won';
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6"
      style={{
        background: won
          ? 'radial-gradient(ellipse at center, rgba(16,80,40,0.55) 0%, rgba(8,4,28,0.96) 80%)'
          : 'radial-gradient(ellipse at center, rgba(120,30,30,0.55) 0%, rgba(8,4,28,0.96) 80%)',
        backdropFilter: 'blur(10px)',
        direction: 'rtl'
      }}
    >
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        className="rounded-full grid place-items-center mb-4"
        style={{
          width: 84,
          height: 84,
          background: won
            ? 'linear-gradient(135deg, #FBBF24, #F59E0B, #EF4444)'
            : 'linear-gradient(135deg, #EF4444, #991B1B)',
          boxShadow: won
            ? '0 18px 50px rgba(245,158,11,0.55)'
            : '0 18px 50px rgba(239,68,68,0.55)'
        }}
      >
        {won ? <Crown size={42} className="text-white" /> : <Skull size={42} className="text-white" />}
      </motion.div>

      <h2
        className="text-white text-center"
        style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 900, fontSize: 28, marginBottom: 6 }}
      >
        {won ? 'انتصار! 🎉' : 'انتهت المهمّة'}
      </h2>
      <p
        className="text-white/70 text-center"
        style={{ fontFamily: 'Cairo, sans-serif', fontSize: 14, marginBottom: 18 }}
      >
        {won ? 'لقد دافعت عن قاعدتك حتى النهاية!' : 'دبّابة ضربت قاعدتك. أعد المحاولة أو واصل.'}
      </p>

      <div
        className="rounded-2xl px-5 py-4 mb-5 text-center"
        style={{
          background: 'rgba(8,4,28,0.65)',
          border: '1px solid rgba(255,255,255,0.10)',
          minWidth: 220
        }}
      >
        <div style={{ fontFamily: 'Cairo, sans-serif', color: 'rgba(255,255,255,0.55)', fontSize: 11 }}>
          تقرير المهمّة
        </div>
        <div className="flex items-center justify-around mt-2 gap-4">
          <div>
            <div
              style={{
                fontFamily: 'Cairo, sans-serif',
                fontSize: 11,
                color: 'rgba(255,255,255,0.55)'
              }}
            >
              الموجة
            </div>
            <div
              style={{
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 900,
                fontSize: 22,
                color: accent
              }}
            >
              {wave}
            </div>
          </div>
          <div>
            <div
              style={{
                fontFamily: 'Cairo, sans-serif',
                fontSize: 11,
                color: 'rgba(255,255,255,0.55)'
              }}
            >
              النقاط
            </div>
            <div
              className="inline-flex items-center gap-1"
              style={{
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 900,
                fontSize: 22,
                color: '#FACC15'
              }}
            >
              <Star size={16} fill="#FACC15" />
              {score}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap justify-center">
        {!won && onRetry && (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onRetry}
            disabled={busy}
            className="rounded-full px-6 py-2.5 inline-flex items-center gap-2"
            style={{
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 800,
              fontSize: 14,
              color: 'white',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.20)',
              cursor: busy ? 'not-allowed' : 'pointer'
            }}
          >
            <RotateCcw size={14} />
            إعادة المحاولة
          </motion.button>
        )}
        <PrimaryButton
          onClick={onContinue}
          disabled={busy}
          gradient={won ? ['#FBBF24', '#F59E0B', '#EF4444'] : [accent, accent, accent]}
        >
          <span className="inline-flex items-center gap-2">
            متابعة
            <ArrowLeft size={16} />
          </span>
        </PrimaryButton>
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function TankAttackGame({ game, accent, onAnswer, onComplete }: GamePluginProps) {
  const questions: Question[] =
    Array.isArray(game.payload?.questionsAr) && game.payload.questionsAr.length > 0
      ? (game.payload.questionsAr as Question[])
      : FALLBACK_QUESTIONS;
  const targetWaves = Number(game.payload?.waves) || DEFAULT_TARGET_WAVES;

  const [phase, setPhase] = useState<Phase>('intro');
  const [countdown, setCountdown] = useState(3);
  const [wave, setWave] = useState(1);
  const [score, setScore] = useState(0);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [question, setQuestion] = useState('');
  const [wrongCount, setWrongCount] = useState(0);
  const [pendingTarget, setPendingTarget] = useState<string | null>(null);
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const [shake, setShake] = useState(false);
  const [flash, setFlash] = useState<'wrong' | 'correct' | 'pending' | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Phase ref so the rAF loop reads the current phase without re-subscribing.
  const phaseRef = useRef(phase);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // Container scale so the fixed-pixel playfield fits any viewport.
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const update = () => {
      if (!wrapRef.current) return;
      const w = wrapRef.current.offsetWidth;
      setScale(Math.min(1, w / GAME_W));
    };
    update();
    const ro = new ResizeObserver(update);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const launchWave = useCallback(
    (n: number) => {
      const w = generateWave(n, questions);
      setQuestion(w.question);
      setEnemies(w.enemies);
      setWrongCount(0);
      setPendingTarget(null);
    },
    [questions]
  );

  const startGame = useCallback(() => {
    setWave(1);
    setScore(0);
    setExplosions([]);
    setEnemies([]);
    setCountdown(3);
    setPhase('countdown');
  }, []);

  // Countdown ticker
  useEffect(() => {
    if (phase !== 'countdown') return;
    if (countdown <= 0) {
      launchWave(1);
      setPhase('playing');
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 700);
    return () => clearTimeout(t);
  }, [phase, countdown, launchWave]);

  const addExplosion = useCallback((x: number, y: number, big = false) => {
    const id = `ex-${Date.now()}-${Math.random()}`;
    setExplosions((ex) => [...ex, { id, x, y, big }]);
    setTimeout(() => setExplosions((ex) => ex.filter((e) => e.id !== id)), 600);
  }, []);

  const triggerFlash = useCallback((kind: 'wrong' | 'correct' | 'pending') => {
    setFlash(kind);
    setTimeout(() => setFlash(null), 220);
  }, []);

  const advanceWave = useCallback(() => {
    setWave((prev) => {
      if (prev >= targetWaves) {
        setPhase('won');
        return prev;
      }
      const next = prev + 1;
      launchWave(next);
      return next;
    });
  }, [targetWaves, launchWave]);

  // rAF game loop — moves enemies toward the player, checks collision.
  useEffect(() => {
    if (phase !== 'playing') return;
    let raf = 0;
    let lastT = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(50, t - lastT);
      lastT = t;
      const factor = dt / 16.67;
      setEnemies((prev) => {
        let collided: Enemy | null = null;
        const upd = prev.map((e) => {
          const dx = PLAYER_X - e.x;
          const dy = PLAYER_Y - e.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < HITBOX && !collided) collided = e;
          if (dist === 0) return e;
          const vx = (dx / dist) * e.speed * factor;
          const vy = (dy / dist) * e.speed * factor;
          return { ...e, x: e.x + vx, y: e.y + vy };
        });
        if (collided && phaseRef.current === 'playing') {
          setPhase('lost');
          setShake(true);
          setTimeout(() => setShake(false), 500);
          addExplosion(PLAYER_X, PLAYER_Y, true);
        }
        return upd;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase, addExplosion]);

  // Fire at an enemy (called from key press OR tank tap).
  const fireAt = useCallback(
    (num: number) => {
      if (phaseRef.current !== 'playing') return;
      if (num < 1 || num > 9) return;
      const target = enemies.find((e) => e.number === num);
      if (!target) return;

      if (target.isCorrect) {
        const inPenalty = wrongCount >= 3;
        if (inPenalty) {
          if (pendingTarget === target.id) {
            // Second hit — kill it
            addExplosion(target.x, target.y, true);
            setScore((s) => s + 100 + wave * 15);
            triggerFlash('correct');
            advanceWave();
          } else {
            setPendingTarget(target.id);
            triggerFlash('pending');
          }
        } else {
          addExplosion(target.x, target.y, true);
          setScore((s) => s + 100 + wave * 15);
          triggerFlash('correct');
          advanceWave();
        }
      } else {
        setWrongCount((c) => c + 1);
        setEnemies((prev) => prev.filter((e) => e.id !== target.id));
        addExplosion(target.x, target.y, false);
        setPendingTarget(null);
        setScore((s) => Math.max(0, s - 25));
        triggerFlash('wrong');
      }
    },
    [enemies, wrongCount, pendingTarget, wave, addExplosion, triggerFlash, advanceWave]
  );

  // Keyboard — accepts both Latin (1-9) and Arabic-Indic digits (٠-٩).
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (phase !== 'playing') return;
      let num = parseInt(e.key, 10);
      if (Number.isNaN(num) && e.key.length === 1) {
        const code = e.key.charCodeAt(0);
        if (code >= 0x0660 && code <= 0x0669) num = code - 0x0660;
      }
      if (!Number.isNaN(num) && num >= 1 && num <= 9) {
        e.preventDefault();
        fireAt(num);
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [phase, fireAt]);

  // Submit & complete — called from result screen "متابعة" button.
  const finishAndContinue = async () => {
    if (submitted) return;
    setSubmitted(true);
    try {
      await onAnswer({ score, wave, won: phase === 'won' });
    } finally {
      onComplete();
    }
  };

  return (
    <div ref={wrapRef} className="w-full max-w-[720px] mx-auto" style={{ direction: 'ltr' }}>
      <div
        style={{
          width: GAME_W * scale,
          height: GAME_H * scale,
          margin: '0 auto',
          position: 'relative'
        }}
      >
        <div
          className={`rounded-3xl overflow-hidden ${shake ? 'tank-shake' : ''}`}
          style={{
            width: GAME_W,
            height: GAME_H,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            position: 'absolute',
            top: 0,
            left: 0,
            background:
              `radial-gradient(ellipse at 25% 15%, ${accent}26 0%, transparent 55%),` +
              `radial-gradient(ellipse at 75% 80%, rgba(167,139,250,0.18) 0%, transparent 60%),` +
              `linear-gradient(180deg, #0b0626 0%, #1a0f3d 100%)`,
            border: `1.5px solid ${accent}55`,
            boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 60px ${accent}22`
          }}
        >
          <Stars />

          {/* Flash overlay */}
          {flash && (
            <div className={`absolute inset-0 z-20 pointer-events-none tank-flash-${flash}`} aria-hidden />
          )}

          {/* HUD */}
          {(phase === 'playing' || phase === 'countdown') && (
            <HUD
              wave={wave}
              targetWaves={targetWaves}
              score={score}
              wrongCount={wrongCount}
              accent={accent}
            />
          )}

          {/* Question banner */}
          {phase === 'playing' && (
            <div
              className="absolute z-20"
              style={{
                top: 14,
                left: '50%',
                transform: 'translateX(-50%)',
                maxWidth: 380,
                width: 'min(380px, 60%)',
                background: 'rgba(8,4,28,0.85)',
                border: `1.5px solid ${accent}66`,
                borderRadius: 16,
                padding: '8px 14px',
                backdropFilter: 'blur(10px)',
                fontFamily: 'Cairo, sans-serif',
                color: 'white',
                textAlign: 'center',
                direction: 'rtl'
              }}
            >
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontWeight: 700 }}>المهمّة</div>
              <div style={{ fontSize: 13, fontWeight: 800, lineHeight: 1.4 }}>{question}</div>
            </div>
          )}

          {/* Enemies */}
          {phase === 'playing' &&
            enemies.map((e) => (
              <EnemyView
                key={e.id}
                enemy={e}
                pending={pendingTarget === e.id}
                onClick={() => fireAt(e.number)}
              />
            ))}

          {/* Explosions */}
          {explosions.map((ex) => (
            <div
              key={ex.id}
              className={`absolute pointer-events-none ${ex.big ? 'tank-explode-big' : 'tank-explode'}`}
              style={{
                left: ex.x,
                top: ex.y,
                fontSize: ex.big ? 64 : 40,
                zIndex: 15,
                transform: 'translate(-50%, -50%)'
              }}
            >
              💥
            </div>
          ))}

          {/* Player tank */}
          <div
            className="absolute"
            style={{
              left: PLAYER_X - TANK_SIZE / 2,
              top: PLAYER_Y - TANK_SIZE / 2,
              zIndex: 5
            }}
          >
            <PlayerTankSVG accent={accent} />
          </div>

          {/* Hitbox indicator */}
          {phase === 'playing' && (
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                left: PLAYER_X - HITBOX,
                top: PLAYER_Y - HITBOX,
                width: HITBOX * 2,
                height: HITBOX * 2,
                border: `1px solid ${accent}33`,
                zIndex: 4
              }}
            />
          )}

          {/* Phase overlays */}
          <AnimatePresence>
            {phase === 'intro' && (
              <IntroScreen onStart={startGame} accent={accent} targetWaves={targetWaves} />
            )}
            {phase === 'countdown' && countdown > 0 && (
              <Countdown key={countdown} n={countdown} accent={accent} />
            )}
            {phase === 'won' && (
              <ResultScreen
                kind="won"
                wave={wave}
                score={score}
                onContinue={finishAndContinue}
                accent={accent}
                busy={submitted}
              />
            )}
            {phase === 'lost' && (
              <ResultScreen
                kind="lost"
                wave={wave}
                score={score}
                onRetry={startGame}
                onContinue={finishAndContinue}
                accent={accent}
                busy={submitted}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Help line under the playfield */}
      <p
        className="text-center text-white/55 mt-3"
        style={{ fontFamily: 'Cairo, sans-serif', fontSize: 12, direction: 'rtl' }}
      >
        <Keyboard size={12} className="inline-block ms-1 -mt-0.5" />
        اضغط ١-٩ لاستهداف الدبّابة، أو المسها مباشرة على الشاشة.
      </p>

      <style>{tankAttackCss}</style>
    </div>
  );
}

// ─── Local CSS keyframes ─────────────────────────────────────────────────────
const tankAttackCss = `
@keyframes tank-shake {
  0%, 100% { transform: translateX(0) translateY(0); }
  20% { transform: translateX(-8px) translateY(2px); }
  40% { transform: translateX(8px) translateY(-2px); }
  60% { transform: translateX(-6px) translateY(1px); }
  80% { transform: translateX(6px) translateY(-1px); }
}
@keyframes tank-explode {
  0% { transform: translate(-50%, -50%) scale(0.4); opacity: 1; }
  50% { transform: translate(-50%, -50%) scale(1.6); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
}
@keyframes tank-explode-big {
  0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
  40% { transform: translate(-50%, -50%) scale(2); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
}
@keyframes tank-flash-wrong { 0%, 100% { background-color: rgba(220, 38, 38, 0); } 50% { background-color: rgba(220, 38, 38, 0.25); } }
@keyframes tank-flash-correct { 0%, 100% { background-color: rgba(34, 197, 94, 0); } 50% { background-color: rgba(34, 197, 94, 0.20); } }
@keyframes tank-flash-pending { 0%, 100% { background-color: rgba(251, 191, 36, 0); } 50% { background-color: rgba(251, 191, 36, 0.20); } }
@keyframes tank-pulse-ring {
  0% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.7); }
  70% { box-shadow: 0 0 0 14px rgba(251, 191, 36, 0); }
  100% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0); }
}
@keyframes tank-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.tank-shake { animation: tank-shake 0.45s; }
.tank-explode { animation: tank-explode 0.55s forwards; }
.tank-explode-big { animation: tank-explode-big 0.6s forwards; }
.tank-flash-wrong { animation: tank-flash-wrong 0.22s; }
.tank-flash-correct { animation: tank-flash-correct 0.22s; }
.tank-flash-pending { animation: tank-flash-pending 0.22s; }
.tank-pulse-ring { animation: tank-pulse-ring 1.2s infinite; }
.tank-pulse { animation: tank-pulse 1.4s ease-in-out infinite; }
`;
