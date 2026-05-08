import React, { useEffect, useState } from 'react';
import { Users, Activity, AlertTriangle, Sparkles } from 'lucide-react';

import { LandingBackdrop } from '../../components/landing/LandingBackdrop';
import { KpiCard } from '../../components/data/KpiCard';
import { GlassPanel, PanelHeader, DauArea, HorizontalBars } from '../../components/data/Charts';
import { api } from '@/lib/api';

interface OverviewData {
  summary: { totalStudents: number; avgXp: number; activeToday: number; struggling: number };
  dau: Array<{ day: string; users: number }>;
  top: Array<{ _id: string; username: string; xp: number }>;
}

export function TeacherOverviewScreen() {
  const [data, setData] = useState<OverviewData | null>(null);
  useEffect(() => {
    api.get('/teacher/overview').then((r) => setData(r.data.data));
  }, []);

  return (
    <div className="relative">
      <LandingBackdrop />
      <div className="relative z-10">
        <header className="mb-6">
          <h1 className="text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 900, fontSize: 28 }}>
            لوحة الأستاذ
          </h1>
          <p className="text-white/65" style={{ fontFamily: 'Cairo, sans-serif', fontSize: 14 }}>
            متابعة تقدّم تلاميذك ودروسك في الوقت الحقيقيّ
          </p>
        </header>

        {!data ? (
          <p className="text-white/55" style={{ fontFamily: 'Cairo' }}>جارٍ التحميل…</p>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard
                icon={<Users size={20} className="text-white" />}
                labelAr="عدد التلاميذ"
                value={data.summary.totalStudents}
                accent="#FBBF24"
              />
              <KpiCard
                icon={<Activity size={20} className="text-white" />}
                labelAr="نشطون اليوم"
                value={data.summary.activeToday}
                trendAr={`${Math.round((data.summary.activeToday / Math.max(1, data.summary.totalStudents)) * 100)}% من الفصل`}
                trendKind="up"
                accent="#34D399"
              />
              <KpiCard
                icon={<Sparkles size={20} className="text-white" />}
                labelAr="متوسط XP"
                value={data.summary.avgXp}
                accent="#A78BFA"
              />
              <KpiCard
                icon={<AlertTriangle size={20} className="text-white" />}
                labelAr="بحاجة لمتابعة"
                value={data.summary.struggling}
                trendAr="سلسلة أقلّ من يومين"
                trendKind="down"
                accent="#F87171"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
              <GlassPanel className="lg:col-span-2" accent="#FBBF24">
                <PanelHeader titleAr="نشاط التلاميذ" hintAr="الحضور اليوميّ آخر 14 يوماً" />
                <DauArea data={data.dau} color="#FBBF24" />
              </GlassPanel>
              <GlassPanel accent="#38BDF8">
                <PanelHeader titleAr="أعلى التلاميذ" hintAr="حسب XP" />
                <HorizontalBars
                  data={data.top.map((s) => ({ name: s.username, value: s.xp }))}
                  color="#38BDF8"
                  height={240}
                />
              </GlassPanel>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
