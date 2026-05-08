import React, { useEffect, useState } from 'react';
import { Users, Activity, GraduationCap, Sparkles } from 'lucide-react';

import { LandingBackdrop } from '../../components/landing/LandingBackdrop';
import { KpiCard } from '../../components/data/KpiCard';
import { GlassPanel, PanelHeader, DauArea, DonutPie, HorizontalBars } from '../../components/data/Charts';
import { api } from '@/lib/api';

interface AdminOverviewData {
  platform: {
    total: number;
    byRole: Record<string, number>;
    totalXp: number;
    totalCompleted: number;
    activeToday: number;
  };
  dau: Array<{ day: string; users: number }>;
  topicSplit: Array<{ name: string; value: number; color: string }>;
  topStudents: Array<{ _id: string; username: string; xp: number }>;
}

export function AdminOverviewScreen() {
  const [data, setData] = useState<AdminOverviewData | null>(null);
  useEffect(() => {
    api.get('/admin/overview').then((r) => setData(r.data.data));
  }, []);

  return (
    <div className="relative">
      <LandingBackdrop />
      <div className="relative z-10">
        <Header titleAr="لوحة المسؤول" subAr="نظرة عامّة على نشاط المنصّة" />
        {!data ? (
          <p className="text-white/55" style={{ fontFamily: 'Cairo' }}>جارٍ التحميل…</p>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard
                icon={<Users size={20} className="text-white" />}
                labelAr="إجمالي المستخدمين"
                value={data.platform.total}
                trendAr="+12% هذا الشهر"
                trendKind="up"
                accent="#FBBF24"
              />
              <KpiCard
                icon={<Activity size={20} className="text-white" />}
                labelAr="نشطون اليوم"
                value={data.platform.activeToday}
                trendAr="+5% منذ الأمس"
                trendKind="up"
                accent="#34D399"
              />
              <KpiCard
                icon={<GraduationCap size={20} className="text-white" />}
                labelAr="دروس مكتملة"
                value={data.platform.totalCompleted}
                trendAr="منذ بدء المنصّة"
                accent="#38BDF8"
              />
              <KpiCard
                icon={<Sparkles size={20} className="text-white" />}
                labelAr="نقاط XP المتراكمة"
                value={data.platform.totalXp.toLocaleString('ar-EG')}
                accent="#A78BFA"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
              <GlassPanel className="lg:col-span-2" accent="#FBBF24">
                <PanelHeader titleAr="المستخدمون النشطون يومياً" hintAr="آخر 14 يوماً" />
                <DauArea data={data.dau} />
              </GlassPanel>
              <GlassPanel accent="#A78BFA">
                <PanelHeader titleAr="توزيع الاهتمام بالمواد" hintAr="نسب الدروس المكتملة" />
                <DonutPie data={data.topicSplit} />
              </GlassPanel>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
              <GlassPanel className="lg:col-span-2" accent="#38BDF8">
                <PanelHeader titleAr="أعلى التلاميذ نقاطاً" hintAr="حسب مجموع XP" />
                <HorizontalBars
                  data={data.topStudents.map((s) => ({ name: s.username, value: s.xp }))}
                  color="#38BDF8"
                  height={260}
                />
              </GlassPanel>
              <GlassPanel accent="#34D399">
                <PanelHeader titleAr="توزيع الأدوار" hintAr="على مستوى المنصّة" />
                <DonutPie
                  data={[
                    { name: 'تلاميذ', value: data.platform.byRole.student || 0, color: '#FBBF24' },
                    { name: 'أساتذة', value: data.platform.byRole.teacher || 0, color: '#38BDF8' },
                    { name: 'أولياء', value: data.platform.byRole.parent || 0, color: '#34D399' },
                    { name: 'مسؤولون', value: data.platform.byRole.admin || 0, color: '#A78BFA' }
                  ]}
                />
              </GlassPanel>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Header({ titleAr, subAr }: { titleAr: string; subAr: string }) {
  return (
    <header className="mb-6">
      <h1 className="text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 900, fontSize: 28 }}>
        {titleAr}
      </h1>
      <p className="text-white/65" style={{ fontFamily: 'Cairo, sans-serif', fontSize: 14 }}>
        {subAr}
      </p>
    </header>
  );
}
