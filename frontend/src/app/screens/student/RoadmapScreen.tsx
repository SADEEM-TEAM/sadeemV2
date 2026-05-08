import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import { Sparkles, ChevronDown } from 'lucide-react';

import { TopicBackdrop } from '../../components/topics/TopicBackdrop';
import { TopicIcon } from '../../components/topics/TopicIcon';
import { LessonPath, LevelBanner } from '../../components/topics/LessonPath';
import { api } from '@/lib/api';
import type { Course, RoadmapLesson } from '@/lib/types';

interface LevelGroup {
  level: number;
  nameAr: string;
  difficulty?: string;
  lessons: RoadmapLesson[];
}

export function RoadmapScreen() {
  const { slug = 'history' } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<RoadmapLesson[]>([]);

  useEffect(() => {
    api.get(`/lessons/roadmap/${slug}`).then(({ data }) => {
      setCourse(data.data.course);
      setLessons(data.data.lessons);
    });
  }, [slug]);

  const groups = useMemo<LevelGroup[]>(() => {
    if (!lessons.length) return [];
    const map = new Map<number, LevelGroup>();
    for (const l of lessons) {
      const lvl = l.level ?? 1;
      if (!map.has(lvl)) {
        map.set(lvl, {
          level: lvl,
          nameAr: l.levelNameAr ?? `المستوى ${lvl}`,
          difficulty: l.levelDifficulty,
          lessons: []
        });
      }
      map.get(lvl)!.lessons.push(l);
    }
    return Array.from(map.values()).sort((a, b) => a.level - b.level);
  }, [lessons]);

  if (!course) return null;
  const accent = course.accent?.gradient[0] ?? '#A78BFA';

  return (
    <div className="relative min-h-[100dvh]">
      <TopicBackdrop topic={course.topic} />

      <div className="relative z-10">
        <header className="flex items-center gap-4 mb-8">
          <div
            className="w-14 h-14 rounded-2xl grid place-items-center"
            style={{
              background: `linear-gradient(135deg, ${course.accent?.gradient[0]}, ${course.accent?.gradient[1] ?? accent})`
            }}
          >
            <TopicIcon topic={course.topic} size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-white" style={{ fontFamily: 'Cairo', fontWeight: 900, fontSize: 26 }}>
              {course.titleAr}
            </h1>
            <p className="text-white/60" style={{ fontFamily: 'Cairo', fontSize: 14 }}>
              {course.descriptionAr}
            </p>
          </div>
        </header>

        <div className="relative max-w-[560px] mx-auto pb-20 flex flex-col gap-10">
          {groups.map((group, gIdx) => {
            const completed = group.lessons.filter((l) => l.status === 'completed').length;
            const total = group.lessons.length;
            const pct = total ? Math.round((completed / total) * 100) : 0;
            const gateOpen = group.lessons.some((l) => l.status !== 'locked');
            return (
              <section key={group.level} className="relative">
                {gIdx > 0 && (
                  <div className="flex flex-col items-center -mt-5 mb-4 opacity-70">
                    <ChevronDown size={20} className="text-white/40" />
                  </div>
                )}

                <LevelBanner
                  level={group.level}
                  nameAr={group.nameAr}
                  difficulty={group.difficulty}
                  accent={accent}
                  pct={pct}
                  completed={completed}
                  total={total}
                  gateOpen={gateOpen}
                />

                <div
                  className="relative rounded-3xl border p-6 mt-2"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                    borderColor: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)'
                  }}
                >
                  <LessonPath
                    lessons={group.lessons}
                    accent={accent}
                    size="sm"
                    onPick={(id) => navigate(`/app/lessons/${id}`)}
                  />
                </div>
              </section>
            );
          })}
          <ComingSoon />
        </div>
      </div>
    </div>
  );
}

function ComingSoon() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 0.5, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center mt-6"
    >
      <div className="w-px h-8 bg-white/20" />
      <div
        className="rounded-2xl px-5 py-3 text-white/60 inline-flex items-center gap-2"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px dashed rgba(255,255,255,0.15)',
          fontFamily: 'Cairo'
        }}
      >
        <Sparkles size={16} className="text-yellow-300" />
        مستويات جديدة قريباً…
      </div>
    </motion.div>
  );
}
