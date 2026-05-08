import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  BookOpen,
  Quote,
  Lightbulb,
  Play,
  FileText
} from 'lucide-react';

import { GlassCard } from '../../components/ui/GlassCard';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { api } from '@/lib/api';
import type { Course, CourseTopic, Lesson } from '@/lib/types';

// One demo YouTube video per topic — every lesson in that topic plays the
// same one for now (placeholder content). To swap a topic's video, change
// the ID here. To make it per-lesson later, move this onto the Lesson model.
const VIDEO_BY_TOPIC: Record<CourseTopic, string> = {
  history: 'YFbbeJZlYXk',
  math: 'c9XWX3g9anE',
  coding: 'S6AmmBFpW0g'
};

type ViewMode = 'video' | 'text';

export function LessonScreen() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [dwell, setDwell] = useState(0);
  const [busy, setBusy] = useState(false);
  // Text shows first by default; the kid can switch to the video at any time.
  const [mode, setMode] = useState<ViewMode>('text');
  const startedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!id) return;
    api.get(`/lessons/${id}`).then(({ data }) => {
      setLesson(data.data);
      api.get('/courses').then(({ data: coursesData }) => {
        setCourse(coursesData.data.find((c: Course) => c._id === data.data.courseId) ?? null);
      });
    });
    startedAtRef.current = Date.now();
    setMode('text');
  }, [id]);

  useEffect(() => {
    const i = setInterval(() => setDwell(Date.now() - startedAtRef.current), 1000);
    return () => clearInterval(i);
  }, []);

  const ready = useMemo(() => {
    if (!lesson) return false;
    return dwell >= Math.floor(lesson.expectedReadMs * 0.7);
  }, [dwell, lesson]);

  const startGames = async () => {
    if (!lesson) return;
    setBusy(true);
    try {
      await api.post(`/lessons/${lesson._id}/read-receipt`, { dwellMs: dwell });
      navigate(`/app/lessons/${lesson._id}/play`);
    } finally {
      setBusy(false);
    }
  };

  if (!lesson || !course) return null;
  const accent = course.accent?.gradient[0] ?? '#A78BFA';
  const pct = Math.min(100, Math.round((dwell / lesson.expectedReadMs) * 100));
  const videoId = VIDEO_BY_TOPIC[course.topic];
  // If a topic has no video configured, force text mode.
  const effectiveMode: ViewMode = videoId ? mode : 'text';

  return (
    <div className="relative min-h-[100dvh]">
      {/* Desktop mode toggle — fixed at the right edge of the viewport,
          vertically centered so it sits at the same level as the text/video. */}
      {videoId && (
        <aside
          className="hidden lg:flex flex-col gap-2 fixed top-1/2 -translate-y-1/2 z-30"
          style={{ insetInlineStart: 20 }}
        >
          <ModeButton
            orientation="vertical"
            icon={<Play size={20} fill="currentColor" />}
            labelAr="فيديو"
            active={effectiveMode === 'video'}
            onClick={() => setMode('video')}
            accent={accent}
          />
          <ModeButton
            orientation="vertical"
            icon={<FileText size={20} />}
            labelAr="نصّ"
            active={effectiveMode === 'text'}
            onClick={() => setMode('text')}
            accent={accent}
          />
        </aside>
      )}

      <div className="relative z-10 max-w-[760px] mx-auto">
        <button
          onClick={() => navigate(`/app/courses/${course.slug}`)}
          className="text-white/70 hover:text-white inline-flex items-center gap-1 mb-4"
          style={{ fontFamily: 'Cairo', fontWeight: 700 }}
        >
          <ArrowLeft size={16} />
          {t('nav.back')}
        </button>

          <header className="mb-6">
            <div
              className="flex items-center gap-2 text-white/60 mb-2"
              style={{ fontFamily: 'Cairo', fontSize: 13 }}
            >
              <BookOpen size={14} />
              {course.titleAr}
            </div>
            <h1
              className="text-white"
              style={{ fontFamily: 'Cairo', fontWeight: 900, fontSize: 28, lineHeight: 1.3 }}
            >
              {lesson.titleAr}
            </h1>
            {lesson.summaryAr && (
              <p className="text-white/70 mt-2" style={{ fontFamily: 'Cairo', fontSize: 16 }}>
                {lesson.summaryAr}
              </p>
            )}
          </header>

          {/* Inline horizontal toggle for tablet/mobile (lg breakpoint hides it). */}
          {videoId && (
            <div className="lg:hidden mb-5 flex">
              <div
                className="inline-flex p-1 rounded-2xl gap-1"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  backdropFilter: 'blur(12px)'
                }}
              >
                <ModeButton
                  orientation="horizontal"
                  icon={<Play size={16} fill="currentColor" />}
                  labelAr="فيديو"
                  active={effectiveMode === 'video'}
                  onClick={() => setMode('video')}
                  accent={accent}
                />
                <ModeButton
                  orientation="horizontal"
                  icon={<FileText size={16} />}
                  labelAr="نصّ"
                  active={effectiveMode === 'text'}
                  onClick={() => setMode('text')}
                  accent={accent}
                />
              </div>
            </div>
          )}

          {/* dwell progress */}
          <div className="mb-6">
            <div
              className="flex items-center justify-between text-xs text-white/60 mb-1.5"
              style={{ fontFamily: 'Cairo' }}
            >
              <span>{t('lesson.progress_label')}</span>
              <span style={{ color: ready ? '#34D399' : '#FACC15' }}>{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                animate={{ width: `${pct}%` }}
                style={{
                  background: `linear-gradient(90deg, ${accent}, ${course.accent?.gradient[1] ?? accent})`
                }}
              />
            </div>
          </div>

          {/* Animated swap between video and text */}
          <AnimatePresence mode="wait" initial={false}>
            {effectiveMode === 'video' && videoId ? (
              <motion.div
                key="video"
                initial={{ opacity: 0, scale: 0.97, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -6 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                <YouTubeEmbed videoId={videoId} accent={accent} />
              </motion.div>
            ) : (
              <motion.div
                key="text"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="flex flex-col gap-5"
              >
                {lesson.contentBlocks.map((block, i) => (
                  <Block key={i} block={block} accent={accent} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <GlassCard accent={ready ? '#34D399' : undefined} className="mt-8 p-6 flex items-center gap-4">
            <Lightbulb size={20} className={ready ? 'text-emerald-400' : 'text-yellow-300'} />
            <div className="flex-1">
              <p
                className="text-white"
                style={{ fontFamily: 'Cairo', fontWeight: 700, fontSize: 15 }}
              >
                {ready ? 'ممتاز! يمكنك الآن خوض التحديات.' : t('lesson.min_dwell')}
              </p>
            </div>
            <PrimaryButton
              onClick={startGames}
              disabled={!ready || busy}
              gradient={
                ready
                  ? [
                      accent,
                      course.accent?.gradient[1] ?? accent,
                      course.accent?.gradient[2] ?? accent
                    ]
                  : ['#3f3f46', '#52525b', '#71717a']
              }
            >
              {busy ? t('common.loading') : t('lesson.start_games')}
            </PrimaryButton>
          </GlassCard>
      </div>
    </div>
  );
}

// ─── Mode toggle button ─────────────────────────────────────────────────────────
function ModeButton({
  icon,
  labelAr,
  active,
  onClick,
  orientation,
  accent
}: {
  icon: React.ReactNode;
  labelAr: string;
  active: boolean;
  onClick: () => void;
  orientation: 'vertical' | 'horizontal';
  accent: string;
}) {
  const vertical = orientation === 'vertical';
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: active ? 1 : 1.04 }}
      whileTap={{ scale: 0.96 }}
      className={`relative rounded-2xl flex items-center justify-center transition-colors ${
        vertical ? 'flex-col gap-1' : 'gap-2 px-4 py-2'
      }`}
      style={{
        width: vertical ? 56 : undefined,
        height: vertical ? 64 : undefined,
        background: active
          ? `linear-gradient(135deg, ${accent}, ${accent}cc)`
          : 'rgba(255,255,255,0.05)',
        border: `1.5px solid ${active ? accent : 'rgba(255,255,255,0.10)'}`,
        color: active ? 'white' : 'rgba(255,255,255,0.78)',
        boxShadow: active ? `0 12px 28px ${accent}55` : 'none',
        cursor: 'pointer',
        fontFamily: 'Cairo, sans-serif',
        fontWeight: 800
      }}
      aria-pressed={active}
    >
      {icon}
      <span style={{ fontSize: vertical ? 10 : 13 }}>{labelAr}</span>
    </motion.button>
  );
}

// ─── YouTube embed ──────────────────────────────────────────────────────────────
// Lite-YouTube pattern: show the real thumbnail with a YT-style red play button,
// swap to the iframe (with autoplay) only when the user clicks.
//
// Thumbnail resolution: not every YouTube video has a `maxresdefault.jpg`. When
// it's missing, YouTube serves a 120x90 grey placeholder (HTTP 200 — *not* a
// 404), so a plain `onError` fallback never fires. We start at `hqdefault.jpg`
// (always exists, 480x360 with letterbox bars that `object-fit: cover` crops
// out to a clean 16:9) and only upgrade to maxres if it actually loads at full
// size. That guarantees a real thumbnail every time.
function YouTubeEmbed({ videoId, accent }: { videoId: string; accent: string }) {
  const [playing, setPlaying] = useState(false);
  const [thumb, setThumb] = useState(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`);

  useEffect(() => {
    setPlaying(false);
    setThumb(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`);
    // Try to upgrade to maxres in the background; only swap in if the real
    // (large) image loads — this avoids the grey-placeholder problem.
    const probe = new Image();
    probe.src = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
    probe.onload = () => {
      if (probe.naturalWidth >= 480) {
        setThumb(probe.src);
      }
    };
  }, [videoId]);

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden"
      style={{
        paddingBottom: '56.25%',
        background: '#000',
        border: `1px solid ${accent}33`,
        boxShadow: `0 24px 60px rgba(0,0,0,0.45), 0 0 32px ${accent}22`
      }}
    >
      {playing ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title="فيديو الدرس"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          style={{ border: 0 }}
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label="تشغيل الفيديو"
          className="absolute inset-0 group"
          style={{ cursor: 'pointer' }}
        >
          {/* Real YouTube thumbnail. `object-fit: cover` crops the letterbox
              bars on hqdefault automatically (4:3 source → 16:9 frame). */}
          <img
            src={thumb}
            alt=""
            aria-hidden
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Subtle vignette so the play button reads on bright thumbnails. */}
          <span
            aria-hidden
            className="absolute inset-0 transition-colors"
            style={{
              background:
                'radial-gradient(60% 60% at 50% 50%, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.35) 100%)'
            }}
          />
          {/* YT-style red play button */}
          <span aria-hidden className="absolute inset-0 grid place-items-center">
            <motion.span
              initial={false}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="grid place-items-center"
              style={{
                width: 78,
                height: 54,
                borderRadius: 14,
                background: 'rgba(220, 38, 38, 0.95)',
                boxShadow:
                  '0 14px 36px rgba(220,38,38,0.55), 0 0 0 1px rgba(255,255,255,0.12) inset'
              }}
            >
              <Play size={26} fill="white" className="text-white" style={{ marginInlineStart: 2 }} />
            </motion.span>
          </span>
        </button>
      )}
    </div>
  );
}

// ─── Text block renderer ────────────────────────────────────────────────────────
function Block({ block, accent }: { block: Lesson['contentBlocks'][number]; accent: string }) {
  if (block.type === 'callout') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl p-5 border-s-4"
        style={{
          background: `linear-gradient(90deg, ${accent}22, transparent)`,
          borderColor: accent,
          fontFamily: 'Cairo'
        }}
      >
        <p className="text-white/90" style={{ fontSize: 15.5, lineHeight: 1.85 }}>
          {block.textAr}
        </p>
      </motion.div>
    );
  }
  if (block.type === 'quote') {
    return (
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <blockquote
          className="text-white/85 italic flex gap-3 p-5"
          style={{ fontFamily: 'Cairo', fontSize: 16, lineHeight: 1.85 }}
        >
          <Quote size={18} className="text-white/50 flex-shrink-0 mt-1.5" />
          <span>{block.textAr}</span>
        </blockquote>
      </motion.div>
    );
  }
  if (block.type === 'example') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="rounded-2xl p-5"
        style={{
          background: 'rgba(96,165,250,0.08)',
          border: '1px dashed rgba(96,165,250,0.4)',
          fontFamily: 'Cairo'
        }}
      >
        <p style={{ color: '#BFDBFE', fontSize: 12, fontWeight: 800, marginBottom: 6 }}>مثال</p>
        <p className="text-white/85" style={{ fontSize: 15, lineHeight: 1.85 }}>
          {block.textAr}
        </p>
      </motion.div>
    );
  }
  return (
    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="text-white/85"
      style={{ fontFamily: 'Cairo', fontSize: 16.5, lineHeight: 1.95 }}
    >
      {block.textAr}
    </motion.p>
  );
}
