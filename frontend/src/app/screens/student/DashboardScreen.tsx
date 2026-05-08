import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Sparkles } from 'lucide-react';

import { LandingBackdrop } from '../../components/landing/LandingBackdrop';
import { PlanetCard } from '../../components/topics/PlanetCard';
import { LessonPath } from '../../components/topics/LessonPath';
import { DailyChallenges } from '../../components/dashboard/DailyChallenges';
import { useAuth } from '@/store/auth.store';
import { api } from '@/lib/api';
import type { Course, CourseTopic, RoadmapLesson } from '@/lib/types';

export function DashboardScreen() {
  const { t } = useTranslation();
  const user = useAuth((s) => s.user);
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[] | null>(null);
  const [activeTopic, setActiveTopic] = useState<CourseTopic>('history');
  const [previewLessons, setPreviewLessons] = useState<RoadmapLesson[]>([]);

  useEffect(() => {
    api.get('/courses').then(({ data }) => {
      setCourses(data.data);
      const first = data.data[0]?.topic ?? 'history';
      setActiveTopic(first);
    });
  }, []);

  useEffect(() => {
    if (!activeTopic) return;
    api.get(`/lessons/roadmap/${activeTopic}`).then(({ data }) => {
      setPreviewLessons(data.data.lessons);
    });
  }, [activeTopic]);

  const activeCourse = courses?.find((c) => c.topic === activeTopic);

  return (
    <div className="relative min-h-[100dvh]">
      <LandingBackdrop />

      <div className="relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white"
          style={{ fontFamily: 'Cairo', fontWeight: 900, fontSize: 26 }}
        >
          {user?.username
            ? t('dashboard.welcome_back', { name: user.username })
            : t('dashboard.welcome_first')}
        </motion.h1>
        <p className="text-white/60 mt-1" style={{ fontFamily: 'Cairo' }}>
          {t('dashboard.your_topics')}
        </p>

        {/* Topic mascot cards (+ a locked teaser for Islamic studies) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {courses?.map((c, i) => {
            const isActive = c.topic === activeTopic;
            const done = c.progress?.completed ?? 0;
            const total = c.progress?.total ?? 0;
            return (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * i }}
              >
                <PlanetCard
                  topic={c.topic}
                  titleAr={c.titleAr}
                  done={done}
                  total={total}
                  selected={isActive}
                  mascotPref={user?.mascotPref ?? 'blue'}
                  onSelect={() => setActiveTopic(c.topic)}
                  onStart={() => navigate(`/app/courses/${c.slug}`)}
                  startLabel={done > 0 ? t('dashboard.continue') : t('dashboard.start')}
                />
              </motion.div>
            );
          })}
          {courses && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * courses.length }}
            >
              <PlanetCard
                topic="islamic"
                titleAr="الدراسات الإسلامية"
                done={0}
                total={0}
                locked
                mascotPref={user?.mascotPref ?? 'blue'}
                onStart={() => undefined}
              />
            </motion.div>
          )}
        </div>

        {/* Roadmap preview with bottom blur fade */}
        {activeCourse && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white" style={{ fontFamily: 'Cairo', fontWeight: 800, fontSize: 18 }}>
                <span className="inline-flex items-center gap-2">
                  <Sparkles size={18} className="text-yellow-300" />
                  {t('dashboard.roadmap_preview')}
                </span>
              </h2>
              <button
                onClick={() => navigate(`/app/courses/${activeCourse.slug}`)}
                className="text-white/70 hover:text-white text-sm inline-flex items-center gap-1"
                style={{ fontFamily: 'Cairo', fontWeight: 700 }}
              >
                {t('dashboard.view_full_roadmap')}
                <ArrowLeft size={14} />
              </button>
            </div>

            <div
              className="relative rounded-3xl border p-6"
              style={{
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                borderColor: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)'
              }}
            >
              <LessonPath
                lessons={previewLessons.slice(0, 6)}
                accent={activeCourse.accent?.gradient[0] ?? '#A78BFA'}
                size="sm"
                onPick={(id) => navigate(`/app/lessons/${id}`)}
              />
              {/* bottom fade-out + blur — Duolingo-style "more ahead" hint */}
              <div
                className="absolute bottom-0 inset-x-0 h-32 pointer-events-none rounded-b-3xl"
                style={{
                  background:
                    'linear-gradient(180deg, transparent 0%, rgba(8,4,28,0.85) 70%, rgba(8,4,28,1) 100%)',
                  backdropFilter: 'blur(2px)'
                }}
              />
            </div>
          </section>
        )}

        {/* Daily challenges — placed below the roadmap so the journey is the first thing seen. */}
        <DailyChallenges />
      </div>
    </div>
  );
}

