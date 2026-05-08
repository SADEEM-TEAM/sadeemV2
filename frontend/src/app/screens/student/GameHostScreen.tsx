import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Heart, Sparkles, X } from 'lucide-react';

import { TopicBackdrop } from '../../components/topics/TopicBackdrop';
import { GlassCard } from '../../components/ui/GlassCard';
import { type MascotEmotion } from '../../components/Mascot';
import { GAME_REGISTRY } from '../../games/_registry';
import { api } from '@/lib/api';
import type { Course, Lesson, MiniGameDoc } from '@/lib/types';
import { useAuth } from '@/store/auth.store';

// Mini-game helper artwork picked by the user's avatar choice.
// Mapping confirmed by product owner: 3 → blue, 5 → pink.
import helperBlue from '@/assets/3-screen-3.png 1.svg';
import helperPink from '@/assets/5-screen-5.png 1.svg';

interface MascotState {
  visible: boolean;
  expression: MascotEmotion;
  messageAr: string;
}

export function GameHostScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const refreshUser = useAuth((s) => s.refresh);
  const userMascot = useAuth((s) => s.user?.mascotPref);

  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [games, setGames] = useState<MiniGameDoc[]>([]);
  const [index, setIndex] = useState(0);
  const [errorsByGame, setErrorsByGame] = useState<Record<string, number>>({});
  const [mascot, setMascot] = useState<MascotState>({ visible: false, expression: 'happy', messageAr: '' });

  useEffect(() => {
    if (!id) return;
    (async () => {
      const lessonRes = await api.get(`/lessons/${id}`);
      setLesson(lessonRes.data.data);
      const coursesRes = await api.get('/courses');
      setCourse(coursesRes.data.data.find((c: Course) => c._id === lessonRes.data.data.courseId) ?? null);
      const gamesRes = await api.get(`/games/lesson/${id}`);
      setGames(gamesRes.data.data);
      // greeting mascot
      try {
        const reactRes = await api.post('/mascot/react', { context: 'lesson_start', lessonId: id });
        const d = reactRes.data.data;
        setMascot({ visible: true, expression: d.expression === 'teaching' ? 'thinking' : 'happy', messageAr: d.messageAr });
        setTimeout(() => setMascot((m) => ({ ...m, visible: false })), 4500);
      } catch {}
    })();
  }, [id]);

  const game = games[index];
  const accent = course?.accent?.gradient[0] ?? '#A78BFA';

  const onAnswer = async (answer: any) => {
    if (!game) return { correct: false, xpEarned: 0, heartsLost: 0, errors: 0 };
    const { data } = await api.post(`/games/${game._id}/submit`, { answer, lang: 'ar' });
    const r = data.data;
    setErrorsByGame((e) => ({ ...e, [game._id]: r.errors }));
    await refreshUser();
    if (!r.correct && r.errors >= 3) {
      try {
        const reactRes = await api.post('/mascot/react', {
          context: 'errors_three',
          errorsCount: r.errors,
          lessonId: id
        });
        const d = reactRes.data.data;
        setMascot({ visible: true, expression: 'thinking', messageAr: `${d.messageAr}${d.hintAr ? ' — ' + d.hintAr : ''}` });
      } catch {}
    } else if (r.correct) {
      try {
        const reactRes = await api.post('/mascot/react', { context: 'celebrate' });
        const d = reactRes.data.data;
        setMascot({ visible: true, expression: 'celebrating', messageAr: d.messageAr });
        setTimeout(() => setMascot((m) => ({ ...m, visible: false })), 2500);
      } catch {}
    }
    return r;
  };

  const onComplete = async () => {
    if (index < games.length - 1) {
      setIndex((i) => i + 1);
      setMascot({ visible: false, expression: 'happy', messageAr: '' });
      return;
    }
    if (lesson) {
      await api.post(`/games/lesson/${lesson._id}/complete`);
      navigate(`/app/celebrate?lesson=${lesson._id}`);
    }
  };

  if (!lesson || !course || !game) {
    return null;
  }

  const Plugin = GAME_REGISTRY[game.gameType]?.Component;
  if (!Plugin) {
    return (
      <div className="text-white p-8" style={{ fontFamily: 'Cairo' }}>
        نوع اللعبة غير معروف: {game.gameType}
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh]">
      <TopicBackdrop topic={course.topic} />

      <div className="relative z-10 flex flex-col items-center pb-16">
        {/* progress strip */}
        <div className="w-full max-w-[760px] mb-6">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => navigate(`/app/courses/${course.slug}`)}
              className="rounded-full w-9 h-9 grid place-items-center text-white/70 hover:text-white"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <X size={16} />
            </button>
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full"
                animate={{ width: `${((index) / games.length) * 100}%` }}
                style={{ background: `linear-gradient(90deg, ${accent}, ${course.accent?.gradient[1] ?? accent})` }}
              />
            </div>
            <span style={{ fontFamily: 'Cairo', color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
              {index + 1}/{games.length}
            </span>
          </div>
          <p
            className="text-white/85 text-center"
            style={{ fontFamily: 'Cairo', fontWeight: 700, fontSize: 14 }}
          >
            {game.instructionAr}
          </p>
        </div>

        <Plugin game={game as any} accent={accent} onAnswer={onAnswer} onComplete={onComplete} />
      </div>

      {/* Mascot stage */}
      <AnimatePresence>
        {mascot.visible && (
          <motion.div
            initial={{ opacity: 0, x: -40, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -40, y: 20 }}
            className="fixed bottom-24 md:bottom-6 start-4 z-50 flex items-end gap-3 max-w-[420px]"
            style={{ direction: 'rtl' }}
          >
            <img
              src={userMascot === 'pink' ? helperPink : helperBlue}
              alt=""
              aria-hidden
              draggable={false}
              style={{
                width: 120,
                height: 120,
                objectFit: 'contain',
                filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.45))',
                userSelect: 'none',
                pointerEvents: 'none',
                flexShrink: 0
              }}
            />
            <GlassCard accent={userMascot === 'pink' ? '#F472B6' : '#60A5FA'} className="px-4 py-3">
              <p className="text-white" style={{ fontFamily: 'Cairo', fontSize: 14, lineHeight: 1.6 }}>
                {mascot.messageAr}
              </p>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
