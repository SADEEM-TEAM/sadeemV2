import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Sparkles, BookOpen, Star, Flame, ArrowLeft, Heart } from 'lucide-react';

import { LandingBackdrop } from '../../components/landing/LandingBackdrop';
import { KpiCard } from '../../components/data/KpiCard';
import { GlassPanel, PanelHeader } from '../../components/data/Charts';
import { api } from '@/lib/api';

interface Kid {
  _id: string;
  username: string;
  xp: number;
  streak: number;
  hearts: number;
  completedLessons: number;
  classroom?: string;
  lastActive: string;
}
interface OverviewData {
  kids: Kid[];
  summary: { totalXp: number; totalCompleted: number; kidsCount: number };
}

export function ParentOverviewScreen() {
  const [data, setData] = useState<OverviewData | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    api.get('/parent/overview').then((r) => setData(r.data.data));
  }, []);

  return (
    <div className="relative">
      <LandingBackdrop />
      <div className="relative z-10">
        <header className="mb-6">
          <h1 className="text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 900, fontSize: 28 }}>
            لوحة وليّ الأمر
          </h1>
          <p className="text-white/65" style={{ fontFamily: 'Cairo, sans-serif', fontSize: 14 }}>
            تابع تقدّم أبنائك في الوقت الحقيقيّ
          </p>
        </header>

        {!data ? (
          <p className="text-white/55" style={{ fontFamily: 'Cairo' }}>جارٍ التحميل…</p>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <KpiCard
                icon={<Sparkles size={20} className="text-white" />}
                labelAr="عدد الأبناء"
                value={data.summary.kidsCount}
                accent="#FBBF24"
              />
              <KpiCard
                icon={<BookOpen size={20} className="text-white" />}
                labelAr="دروس مكتملة"
                value={data.summary.totalCompleted}
                trendAr="+3 هذا الأسبوع"
                trendKind="up"
                accent="#34D399"
              />
              <KpiCard
                icon={<Star size={20} className="text-white" />}
                labelAr="مجموع XP"
                value={data.summary.totalXp.toLocaleString('ar-EG')}
                accent="#A78BFA"
              />
            </div>

            <h2 className="text-white mt-8 mb-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: 18 }}>
              أبناؤك
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.kids.map((k, i) => (
                <motion.div
                  key={k._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i }}
                >
                  <GlassPanel accent="#FBBF24">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 900, fontSize: 18 }}>
                          {k.username}
                        </h3>
                        {k.classroom && (
                          <p className="text-white/55" style={{ fontFamily: 'Cairo, sans-serif', fontSize: 12 }}>
                            {k.classroom}
                          </p>
                        )}
                      </div>
                      <div className="text-end">
                        <span style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 900, fontSize: 22, color: '#FBBF24' }}>
                          {k.xp}
                        </span>
                        <p className="text-white/55" style={{ fontFamily: 'Cairo, sans-serif', fontSize: 11 }}>XP</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      <Stat icon={<Flame size={12} className="text-orange-300" />} value={`${k.streak} يوم`} />
                      <Stat icon={<Heart size={12} fill="#FB7185" className="text-rose-400" />} value={`${k.hearts}/5`} />
                      <Stat icon={<BookOpen size={12} className="text-sky-300" />} value={`${k.completedLessons} درس`} />
                    </div>
                    <button
                      onClick={() => navigate(`/parent/kids/${k._id}`)}
                      className="mt-4 w-full rounded-xl px-4 py-2.5 text-sm inline-flex items-center justify-center gap-1.5"
                      style={{
                        fontFamily: 'Cairo, sans-serif',
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #FBBF24, #F59E0B, #EF4444)',
                        color: 'white',
                        boxShadow: '0 8px 24px rgba(245,158,11,0.35)'
                      }}
                    >
                      التقرير المفصّل
                      <ArrowLeft size={14} />
                    </button>
                  </GlassPanel>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Stat({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1"
      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', color: 'white' }}
    >
      {icon}
      {value}
    </span>
  );
}
