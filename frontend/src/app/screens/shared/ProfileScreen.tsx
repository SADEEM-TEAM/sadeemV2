import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Mail,
  LogOut,
  Star,
  Flame,
  Heart,
  BookOpen,
  Target,
  GraduationCap,
  School,
  CalendarDays,
  Sparkles,
  Check
} from 'lucide-react';

import { LandingBackdrop } from '../../components/landing/LandingBackdrop';
import { Mascot } from '../../components/Mascot';
import { useAuth } from '@/store/auth.store';
import { api } from '@/lib/api';
import type { MascotPref } from '@/lib/types';

const ROLE_LABEL: Record<string, string> = {
  student: 'تلميذ',
  teacher: 'أستاذ',
  parent: 'وليّ أمر',
  admin: 'مسؤول'
};

export function ProfileScreen() {
  const { user, refresh, logout } = useAuth();
  const navigate = useNavigate();
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [savingMascot, setSavingMascot] = useState(false);

  useEffect(() => {
    api
      .get('/progress/me')
      .then(({ data }) => setCompletedCount(Array.isArray(data.data) ? data.data.length : 0))
      .catch(() => setCompletedCount(0));
  }, []);

  if (!user) return null;

  const onSignOut = () => {
    logout();
    navigate('/');
  };

  const onPickMascot = async (pref: MascotPref) => {
    if (savingMascot || pref === user.mascotPref) return;
    setSavingMascot(true);
    try {
      await api.patch('/users/me', { mascotPref: pref });
      await refresh();
    } finally {
      setSavingMascot(false);
    }
  };

  const onb = user.onboarding ?? { completed: false };

  return (
    <div className="relative">
      <LandingBackdrop />
      <div className="relative z-10 flex flex-col gap-6 max-w-[920px] mx-auto">
        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl p-6 md:p-8 overflow-hidden"
          style={{
            background:
              'radial-gradient(120% 120% at 100% 0%, rgba(245,158,11,0.18) 0%, rgba(8,4,28,0) 60%), linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(245,158,11,0.3)',
            backdropFilter: 'blur(14px)',
            boxShadow: '0 18px 50px rgba(0,0,0,0.4)'
          }}
        >
          {/* Stack centered on mobile, side-by-side from sm+ — fixes the empty-gap
              bug caused by min-width forcing the text block onto its own row. */}
          <div className="flex flex-col items-center text-center gap-4 sm:flex-row sm:items-center sm:text-start sm:gap-5">
            <div
              className="relative rounded-3xl grid place-items-center flex-shrink-0"
              style={{
                width: 96,
                height: 96,
                background:
                  'linear-gradient(135deg, rgba(251,191,36,0.25), rgba(239,68,68,0.18))',
                border: '2px solid rgba(245,158,11,0.55)',
                boxShadow: '0 14px 36px rgba(245,158,11,0.35)'
              }}
            >
              <Mascot variant={user.mascotPref} size={80} emotion="happy" />
            </div>

            <div className="flex-1 min-w-0 w-full">
              <h1
                className="text-white truncate"
                style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 900, fontSize: 24 }}
              >
                {user.username}
              </h1>
              <p
                className="text-white/70 inline-flex items-center gap-2 mt-1 max-w-full"
                style={{ fontFamily: 'Cairo, sans-serif', fontSize: 13 }}
              >
                <Mail size={13} className="flex-shrink-0" />
                <span className="truncate">{user.email}</span>
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                <span
                  className="rounded-full px-2.5 py-0.5 text-[11px]"
                  style={{
                    fontFamily: 'Cairo, sans-serif',
                    fontWeight: 800,
                    background: 'rgba(245,158,11,0.18)',
                    color: '#FBBF24',
                    border: '1px solid rgba(245,158,11,0.45)'
                  }}
                >
                  {ROLE_LABEL[user.role]}
                </span>
                {onb.completed && (
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[11px] inline-flex items-center gap-1"
                    style={{
                      fontFamily: 'Cairo, sans-serif',
                      fontWeight: 800,
                      background: 'rgba(34,197,94,0.18)',
                      color: '#86EFAC',
                      border: '1px solid rgba(34,197,94,0.4)'
                    }}
                  >
                    <Check size={11} />
                    حساب مفعّل
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Stats grid ──────────────────────────────────────────────────── */}
        <section>
          <SectionTitle icon={<Sparkles size={16} className="text-yellow-300" />} title="إحصائياتك" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              icon={<Star size={18} className="text-yellow-300" fill="#FACC15" />}
              label="مجموع النقاط"
              value={user.xp.toLocaleString('ar-DZ')}
              accent="#FACC15"
            />
            <StatCard
              icon={<Flame size={18} className="text-orange-400" />}
              label="السلسلة"
              value={`${user.streak} يوم`}
              accent="#FB923C"
            />
            <StatCard
              icon={<Heart size={18} className="text-rose-400" fill="#FB7185" />}
              label="القلوب"
              value={`${user.hearts} / 5`}
              accent="#FB7185"
            />
            <StatCard
              icon={<BookOpen size={18} className="text-violet-300" />}
              label="دروس مُنجَزة"
              value={completedCount.toLocaleString('ar-DZ')}
              accent="#A78BFA"
            />
          </div>
        </section>

        {/* ── Mascot preference picker ────────────────────────────────────── */}
        <section>
          <SectionTitle icon={<Sparkles size={16} className="text-yellow-300" />} title="رفيقك في الرحلة" />
          <div className="grid grid-cols-2 gap-3">
            {(['blue', 'pink'] as const).map((pref) => {
              const selected = user.mascotPref === pref;
              return (
                <button
                  key={pref}
                  onClick={() => onPickMascot(pref)}
                  disabled={savingMascot}
                  className="relative rounded-2xl p-5 flex items-center gap-4 transition-all"
                  style={{
                    background: selected
                      ? 'linear-gradient(135deg, rgba(251,191,36,0.18), rgba(239,68,68,0.10))'
                      : 'rgba(255,255,255,0.04)',
                    border: `1.5px solid ${selected ? 'rgba(245,158,11,0.55)' : 'rgba(255,255,255,0.10)'}`,
                    boxShadow: selected ? '0 12px 32px rgba(245,158,11,0.25)' : 'none',
                    cursor: savingMascot ? 'wait' : 'pointer',
                    opacity: savingMascot && !selected ? 0.6 : 1
                  }}
                >
                  <Mascot variant={pref} size={52} emotion="happy" />
                  <div className="flex-1 text-start">
                    <p
                      style={{
                        fontFamily: 'Cairo, sans-serif',
                        fontWeight: 900,
                        fontSize: 14,
                        color: 'white'
                      }}
                    >
                      {pref === 'blue' ? 'الرفيق الأزرق' : 'الرفيقة الورديّة'}
                    </p>
                    <p
                      style={{
                        fontFamily: 'Cairo, sans-serif',
                        fontSize: 12,
                        color: 'rgba(255,255,255,0.6)'
                      }}
                    >
                      {pref === 'blue' ? 'هادئ ومرح' : 'حيويّة ومُلهمة'}
                    </p>
                  </div>
                  {selected && (
                    <span
                      className="rounded-full p-1.5 flex-shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, #FBBF24, #F59E0B)',
                        boxShadow: '0 6px 14px rgba(245,158,11,0.45)'
                      }}
                    >
                      <Check size={14} className="text-white" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Account info ────────────────────────────────────────────────── */}
        <section>
          <SectionTitle icon={<Sparkles size={16} className="text-yellow-300" />} title="معلومات الحساب" />
          <div
            className="rounded-2xl divide-y divide-white/5"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(12px)'
            }}
          >
            <InfoRow icon={<Mail size={14} />} label="البريد الإلكتروني" value={user.email} />
            {onb.age != null && (
              <InfoRow icon={<CalendarDays size={14} />} label="العمر" value={`${onb.age} سنة`} />
            )}
            {onb.gradeLabel && (
              <InfoRow
                icon={<GraduationCap size={14} />}
                label="المستوى الدراسي"
                value={onb.gradeLabel}
              />
            )}
            {onb.establishment && (
              <InfoRow icon={<School size={14} />} label="المؤسّسة" value={onb.establishment} />
            )}
            {onb.dailyGoalXp != null && (
              <InfoRow
                icon={<Target size={14} />}
                label="الهدف اليومي"
                value={`${onb.dailyGoalXp} XP`}
              />
            )}
          </div>
        </section>

        {/* ── Logout ─────────────────────────────────────────────────────── */}
        <section className="flex justify-start pt-2">
          <button
            onClick={onSignOut}
            className="rounded-full px-5 py-2.5 text-sm inline-flex items-center gap-2 text-rose-300 hover:text-rose-200 transition-colors"
            style={{
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 800,
              background: 'rgba(244,63,94,0.10)',
              border: '1px solid rgba(244,63,94,0.4)'
            }}
          >
            <LogOut size={14} />
            تسجيل الخروج
          </button>
        </section>
      </div>
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {icon}
      <h2
        className="text-white"
        style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: 16 }}
      >
        {title}
      </h2>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${accent}33`,
        backdropFilter: 'blur(12px)'
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span
          style={{
            fontFamily: 'Cairo, sans-serif',
            fontSize: 12,
            color: 'rgba(255,255,255,0.65)',
            fontWeight: 700
          }}
        >
          {label}
        </span>
      </div>
      <p
        style={{
          fontFamily: 'Cairo, sans-serif',
          fontWeight: 900,
          fontSize: 22,
          color: accent,
          textShadow: `0 2px 12px ${accent}44`
        }}
      >
        {value}
      </p>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="text-white/55 flex-shrink-0">{icon}</span>
      <span
        className="flex-1"
        style={{
          fontFamily: 'Cairo, sans-serif',
          fontSize: 13,
          color: 'rgba(255,255,255,0.65)',
          fontWeight: 700
        }}
      >
        {label}
      </span>
      <span
        className="truncate text-end"
        style={{
          fontFamily: 'Cairo, sans-serif',
          fontSize: 13,
          color: 'white',
          fontWeight: 800
        }}
      >
        {value}
      </span>
    </div>
  );
}
