import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowRight, Star, Flame, BookOpen, Award, MessageSquare } from 'lucide-react';

import { LandingBackdrop } from '../../components/landing/LandingBackdrop';
import { KpiCard } from '../../components/data/KpiCard';
import { GlassPanel, PanelHeader, DauArea, TopicBars } from '../../components/data/Charts';
import { api } from '@/lib/api';

interface KidDetail {
  kid: {
    _id: string;
    username: string;
    xp: number;
    streak: number;
    hearts: number;
    completedLessons: number;
    classroom?: string;
    lastActive: string;
  };
  weeklyXp: Array<{ day: string; xp: number }>;
  topicMastery: Array<{ topic: string; value: number; color: string }>;
  teacher: { _id: string; username: string; email: string } | null;
}

export function ParentKidScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<KidDetail | null>(null);

  useEffect(() => {
    if (!id) return;
    api.get(`/parent/kids/${id}`).then((r) => setData(r.data.data));
  }, [id]);

  return (
    <div className="relative">
      <LandingBackdrop />
      <div className="relative z-10">
        <button
          onClick={() => navigate('/parent')}
          className="text-white/70 hover:text-white inline-flex items-center gap-1 mb-4"
          style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
        >
          <ArrowRight size={16} />
          رجوع
        </button>

        {!data ? (
          <p className="text-white/55" style={{ fontFamily: 'Cairo' }}>جارٍ التحميل…</p>
        ) : (
          <>
            <header className="mb-6">
              <h1 className="text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 900, fontSize: 28 }}>
                {data.kid.username}
              </h1>
              <p className="text-white/65" style={{ fontFamily: 'Cairo, sans-serif', fontSize: 14 }}>
                {data.kid.classroom ?? 'تلميذ'} • آخر نشاط {data.kid.lastActive}
              </p>
            </header>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard icon={<Star size={20} className="text-white" />} labelAr="مجموع XP" value={data.kid.xp} accent="#FBBF24" />
              <KpiCard icon={<Flame size={20} className="text-white" />} labelAr="السلسلة" value={`${data.kid.streak} يوم`} accent="#F87171" />
              <KpiCard icon={<BookOpen size={20} className="text-white" />} labelAr="دروس مكتملة" value={data.kid.completedLessons} accent="#38BDF8" />
              <KpiCard icon={<Award size={20} className="text-white" />} labelAr="القلوب" value={`${data.kid.hearts}/5`} accent="#34D399" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
              <GlassPanel className="lg:col-span-2" accent="#FBBF24">
                <PanelHeader titleAr="نقاط الخبرة الأسبوعية" hintAr="آخر 7 أيام" />
                <DauArea
                  data={data.weeklyXp.map((d) => ({ day: d.day, users: d.xp }))}
                  color="#FBBF24"
                  height={220}
                />
              </GlassPanel>
              <GlassPanel accent="#A78BFA">
                <PanelHeader titleAr="الإتقان حسب المادّة" hintAr="نسبة من 100" />
                <TopicBars data={data.topicMastery} />
              </GlassPanel>
            </div>

            {data.teacher && (
              <GlassPanel accent="#38BDF8" className="mt-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-white/55" style={{ fontFamily: 'Cairo, sans-serif', fontSize: 12 }}>
                      الأستاذ المشرف
                    </p>
                    <h3 className="text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: 18 }}>
                      {data.teacher.username}
                    </h3>
                    <p className="text-white/55" style={{ fontFamily: 'Cairo, sans-serif', fontSize: 12 }}>
                      {data.teacher.email}
                    </p>
                  </div>
                  <button
                    className="rounded-full px-4 py-2 text-sm inline-flex items-center gap-2"
                    style={{
                      fontFamily: 'Cairo, sans-serif',
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, rgba(96,165,250,0.22), rgba(167,139,250,0.18))',
                      border: '1px solid rgba(96,165,250,0.5)',
                      color: 'white'
                    }}
                  >
                    <MessageSquare size={14} />
                    مراسلة الأستاذ
                    <span
                      className="text-[10px] rounded-full px-1.5 py-0.5"
                      style={{
                        background: 'rgba(167,139,250,0.18)',
                        color: '#C4B5FD',
                        border: '1px solid rgba(167,139,250,0.4)'
                      }}
                    >
                      قريباً
                    </span>
                  </button>
                </div>
              </GlassPanel>
            )}
          </>
        )}
      </div>
    </div>
  );
}
