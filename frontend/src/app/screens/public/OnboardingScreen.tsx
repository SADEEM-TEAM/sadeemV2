import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Scroll,
  Sigma,
  Code2,
  Check
} from 'lucide-react';

import { GlassCard } from '../../components/ui/GlassCard';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { Mascot } from '../../components/Mascot';
import { useAuth } from '@/store/auth.store';
import { homePathForRole } from '../../layouts/navConfig';
import type { CourseTopic } from '@/lib/types';

const TOPIC_VISUAL: Record<CourseTopic, { icon: React.ComponentType<any>; color: string }> = {
  history: { icon: Scroll, color: '#F97316' },
  math: { icon: Sigma, color: '#38BDF8' },
  coding: { icon: Code2, color: '#34D399' }
};

const BRAND_GRADIENT: [string, string, string] = ['#FBBF24', '#F59E0B', '#EF4444'];
const BRAND_ACCENT = '#F59E0B';

const GRADES = [
  'ابتدائي 1-3',
  'ابتدائي 4-5',
  'متوسط 1',
  'متوسط 2-3',
  'متوسط 4',
  'ثانوي 1-2',
  'ثانوي 3 (باك)'
];

const GOALS = [
  { value: 15, key: 'goal_chill' as const },
  { value: 30, key: 'goal_normal' as const },
  { value: 60, key: 'goal_intense' as const }
];

const TOPICS: CourseTopic[] = ['history', 'math', 'coding'];
const SOURCES = ['source_friend', 'source_social', 'source_school', 'source_other'] as const;

export function OnboardingScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuth((s) => s.user);
  const save = useAuth((s) => s.saveOnboarding);

  const role = user?.role ?? 'student';
  const isParent = role === 'parent';
  const isTeacher = role === 'teacher';

  // Step shape changes by role:
  //  student  : age+grade  → mascot → interests → daily goal → source
  //  parent   : child age+grade → child name → mascot → interests → source
  //  teacher  : establishment → grade(s) taught → mascot → interests → source
  const steps = useMemo<string[]>(() => {
    if (isParent) return ['child', 'childName', 'mascot', 'interests', 'source'];
    if (isTeacher) return ['establishment', 'mascot', 'interests', 'source'];
    return ['ageGrade', 'mascot', 'interests', 'goal', 'source'];
  }, [isParent, isTeacher]);

  const [step, setStep] = useState(0);
  const [age, setAge] = useState<number | undefined>();
  const [grade, setGrade] = useState<string | undefined>();
  const [childName, setChildName] = useState('');
  const [establishment, setEstablishment] = useState('');
  const [mascot, setMascot] = useState<'blue' | 'pink'>(user?.mascotPref ?? 'blue');
  const [goal, setGoal] = useState<number>(30);
  const [interests, setInterests] = useState<CourseTopic[]>([]);
  const [source, setSource] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  const totalSteps = steps.length;
  const currentStepKey = steps[step];

  const canNext = (() => {
    if (currentStepKey === 'ageGrade' || currentStepKey === 'child')
      return !!age && age > 4 && age < 80 && !!grade;
    if (currentStepKey === 'childName') return childName.trim().length > 1;
    if (currentStepKey === 'establishment') return establishment.trim().length > 1;
    if (currentStepKey === 'interests') return interests.length > 0;
    if (currentStepKey === 'source') return !!source;
    return true;
  })();

  const finish = async () => {
    setBusy(true);
    try {
      await save({
        age,
        gradeLabel: grade,
        establishment: establishment || undefined,
        mascotPref: mascot,
        dailyGoalXp: goal
      });
      navigate(homePathForRole(user?.role), { replace: true });
    } finally {
      setBusy(false);
    }
  };

  const toggleInterest = (t: CourseTopic) => {
    setInterests((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-6 py-12">
      <div className="relative z-10 w-full max-w-[640px]">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h1 style={{ fontFamily: 'Cairo', fontWeight: 900, fontSize: 28, color: 'white' }}>
            {t('onboarding.title')}
          </h1>
          <p className="text-white/60 mt-1" style={{ fontFamily: 'Cairo', fontSize: 13 }}>
            {t('onboarding.step', { n: step + 1, total: totalSteps })}
          </p>
        </motion.div>

        <ProgressBar current={step + 1} total={totalSteps} />

        <GlassCard accent={BRAND_ACCENT} className="p-7 mt-5 min-h-[340px]">
          {/* Step container — keyed so it animates fresh on each step,
              without AnimatePresence (which was holding the Next button) */}
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-5"
          >
              {(currentStepKey === 'ageGrade' || currentStepKey === 'child') && (
                <>
                  <Question text={t(currentStepKey === 'child' ? 'onboarding.child_age_q' : 'onboarding.age_q')} />
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={2}
                    value={age ?? ''}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '');
                      if (digits === '') return setAge(undefined);
                      const n = parseInt(digits, 10);
                      setAge(Number.isFinite(n) ? n : undefined);
                    }}
                    placeholder="12"
                    className="w-32 mx-auto text-center bg-white/8 border border-white/15 rounded-2xl px-4 py-3 text-white outline-none focus:border-amber-400"
                    style={{ fontFamily: 'Cairo', fontSize: 28, fontWeight: 800 }}
                  />

                  <Question text={t(currentStepKey === 'child' ? 'onboarding.child_grade_q' : 'onboarding.grade_q')} />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {GRADES.map((g) => (
                      <Pill key={g} active={grade === g} onClick={() => setGrade(g)}>
                        {g}
                      </Pill>
                    ))}
                  </div>
                </>
              )}

              {currentStepKey === 'childName' && (
                <>
                  <Question text={t('onboarding.child_name_q')} />
                  <input
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    className="w-full bg-white/8 border border-white/15 rounded-2xl px-4 py-3 text-white outline-none focus:border-amber-400"
                    style={{ fontFamily: 'Cairo', fontSize: 16 }}
                  />
                </>
              )}

              {currentStepKey === 'establishment' && (
                <>
                  <Question text={t('onboarding.establishment_q')} />
                  <input
                    type="text"
                    value={establishment}
                    onChange={(e) => setEstablishment(e.target.value)}
                    className="w-full bg-white/8 border border-white/15 rounded-2xl px-4 py-3 text-white outline-none focus:border-amber-400"
                    style={{ fontFamily: 'Cairo', fontSize: 16 }}
                  />
                </>
              )}

              {currentStepKey === 'mascot' && (
                <>
                  <Question text={t('onboarding.mascot_q')} />
                  <div className="grid grid-cols-2 gap-3">
                    {(['blue', 'pink'] as const).map((m) => {
                      const active = mascot === m;
                      return (
                        <button
                          key={m}
                          onClick={() => setMascot(m)}
                          className="relative rounded-3xl p-5 flex flex-col items-center gap-3"
                          style={{
                            background: active
                              ? `linear-gradient(180deg, ${BRAND_ACCENT}33, ${BRAND_ACCENT}10)`
                              : 'rgba(255,255,255,0.04)',
                            border: `2px solid ${active ? BRAND_ACCENT : 'rgba(255,255,255,0.10)'}`
                          }}
                        >
                          <Mascot emotion="happy" size={120} variant={m} />
                          <span style={{ fontFamily: 'Cairo', fontWeight: 800, color: 'white' }}>
                            {t(`onboarding.mascot_${m}`)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {currentStepKey === 'interests' && (
                <>
                  <Question text={t('onboarding.interests_q')} />
                  <p className="text-white/55 -mt-3" style={{ fontFamily: 'Cairo', fontSize: 13 }}>
                    {t('onboarding.interests_hint')}
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {TOPICS.map((topic) => (
                      <InterestCard
                        key={topic}
                        topic={topic}
                        labelAr={t(`onboarding.topic_${topic}`)}
                        active={interests.includes(topic)}
                        onClick={() => toggleInterest(topic)}
                      />
                    ))}
                  </div>
                </>
              )}

              {currentStepKey === 'goal' && (
                <>
                  <Question text={t('onboarding.goal_q')} />
                  <div className="flex flex-col gap-2">
                    {GOALS.map(({ value, key }) => (
                      <button
                        key={value}
                        onClick={() => setGoal(value)}
                        className="rounded-2xl px-4 py-4 flex items-center justify-between"
                        style={{
                          background:
                            goal === value
                              ? `linear-gradient(90deg, ${BRAND_ACCENT}33, rgba(239,68,68,0.2))`
                              : 'rgba(255,255,255,0.04)',
                          border: `1.5px solid ${goal === value ? BRAND_ACCENT : 'rgba(255,255,255,0.10)'}`
                        }}
                      >
                        <span className="inline-flex items-center gap-2 text-white" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>
                          <Sparkles size={16} className="text-yellow-300" />
                          {t(`onboarding.${key}`)}
                        </span>
                        <span style={{ fontFamily: 'Cairo', fontWeight: 800, color: '#FACC15' }}>
                          {value} XP
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {currentStepKey === 'source' && (
                <>
                  <Question text={t('onboarding.source_q')} />
                  <div className="grid grid-cols-2 gap-2">
                    {SOURCES.map((s) => (
                      <Pill key={s} active={source === s} onClick={() => setSource(s)}>
                        {t(`onboarding.${s}`)}
                      </Pill>
                    ))}
                  </div>
                </>
              )}
          </motion.div>
        </GlassCard>

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="text-white/70 hover:text-white inline-flex items-center gap-1 disabled:opacity-30"
            style={{ fontFamily: 'Cairo', fontWeight: 700 }}
          >
            <ArrowRight size={18} />
            {t('onboarding.prev')}
          </button>

          {step < totalSteps - 1 ? (
            <PrimaryButton
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext}
              gradient={BRAND_GRADIENT}
            >
              <span className="inline-flex items-center gap-2">
                {t('onboarding.next')}
                <ArrowLeft size={18} />
              </span>
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={finish} disabled={busy || !canNext} gradient={BRAND_GRADIENT}>
              {busy ? t('common.loading') : t('onboarding.finish')}
            </PrimaryButton>
          )}
        </div>
      </div>
    </div>
  );
}

function Question({ text }: { text: string }) {
  return (
    <h3 className="text-white/90" style={{ fontFamily: 'Cairo', fontWeight: 800, fontSize: 18 }}>
      {text}
    </h3>
  );
}

function InterestCard({
  topic,
  labelAr,
  active,
  onClick
}: {
  topic: CourseTopic;
  labelAr: string;
  active: boolean;
  onClick: () => void;
}) {
  const { icon: Icon, color } = TOPIC_VISUAL[topic];
  return (
    <button
      onClick={onClick}
      className="relative rounded-2xl p-4 flex flex-col items-center gap-2 transition-all"
      style={{
        background: active
          ? `linear-gradient(180deg, ${color}33 0%, ${color}0F 100%)`
          : 'rgba(255,255,255,0.04)',
        border: `1.5px solid ${active ? color : 'rgba(255,255,255,0.10)'}`,
        boxShadow: active ? `0 14px 32px ${color}33` : 'none'
      }}
    >
      {active && (
        <span
          aria-hidden
          className="absolute rounded-full grid place-items-center"
          style={{
            top: 8,
            insetInlineEnd: 8,
            width: 22,
            height: 22,
            background: `linear-gradient(135deg, ${color}, ${color}cc)`,
            boxShadow: `0 4px 12px ${color}66`
          }}
        >
          <Check size={12} className="text-white" strokeWidth={3} />
        </span>
      )}
      <span
        className="rounded-2xl grid place-items-center"
        style={{
          width: 56,
          height: 56,
          background: active ? `linear-gradient(135deg, ${color}cc, ${color}66)` : 'rgba(255,255,255,0.06)',
          border: `1px solid ${active ? `${color}99` : 'rgba(255,255,255,0.10)'}`,
          color: active ? 'white' : color
        }}
      >
        <Icon size={28} strokeWidth={2.2} />
      </span>
      <span
        className="text-center"
        style={{
          fontFamily: 'Cairo, sans-serif',
          fontWeight: 800,
          fontSize: 13,
          color: active ? 'white' : 'rgba(255,255,255,0.78)',
          lineHeight: 1.3
        }}
      >
        {labelAr}
      </span>
    </button>
  );
}

function Pill({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl px-3 py-2.5 text-sm transition-all"
      style={{
        fontFamily: 'Cairo, sans-serif',
        fontWeight: 700,
        background: active
          ? 'linear-gradient(90deg, rgba(251,191,36,0.25), rgba(239,68,68,0.18))'
          : 'rgba(255,255,255,0.05)',
        color: active ? 'white' : 'rgba(255,255,255,0.7)',
        border: `1.5px solid ${active ? '#F59E0B' : 'rgba(255,255,255,0.10)'}`
      }}
    >
      {children}
    </button>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        animate={{ width: `${(current / total) * 100}%` }}
        transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        style={{ background: 'linear-gradient(90deg, #FBBF24, #F59E0B, #EF4444)' }}
      />
    </div>
  );
}
