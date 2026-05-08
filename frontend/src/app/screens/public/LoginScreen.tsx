import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Mail, Lock } from 'lucide-react';

import { GlassCard } from '../../components/ui/GlassCard';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { BrandLogo } from '../../components/ui/BrandLogo';
import { useAuth } from '@/store/auth.store';
import { homePathForRole } from '../../layouts/navConfig';

export function LoginScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuth((s) => s.login);
  const enterDemoMode = useAuth((s) => s.enterDemoMode);
  const loading = useAuth((s) => s.loading);

  const [email, setEmail] = useState('demo@sadeen.dz');
  const [password, setPassword] = useState('demo1234');
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const user = await login(email, password);
      navigate(user.onboarding?.completed ? homePathForRole(user.role) : '/onboarding', { replace: true });
    } catch (err: any) {
      const code = err?.response?.status;
      setError(code === 401 ? t('auth.error_credentials') : t('auth.error_generic'));
    }
  };

  const startDemo = async (role: 'student' | 'teacher' | 'parent' | 'admin' = 'student') => {
    const u = await enterDemoMode(role);
    navigate(homePathForRole(u.role), { replace: true });
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[460px]"
      >
        <div className="flex flex-col items-center gap-3 mb-6">
          <BrandLogo size={48} />
          <h1 className="text-white" style={{ fontFamily: 'Cairo', fontWeight: 800, fontSize: 22 }}>
            {t('auth.login_title')}
          </h1>
        </div>

        <GlassCard accent="#F59E0B" className="p-7">
          <form onSubmit={submit} className="flex flex-col gap-4">
            <Field icon={<Mail size={18} className="text-white/60" />} placeholder={t('auth.email')} value={email} type="email" onChange={setEmail} />
            <Field icon={<Lock size={18} className="text-white/60" />} placeholder={t('auth.password')} value={password} type="password" onChange={setPassword} />

            {error && (
              <p className="text-rose-300 text-sm" style={{ fontFamily: 'Cairo' }}>
                {error}
              </p>
            )}

            <PrimaryButton type="submit" disabled={loading} fullWidth gradient={['#FBBF24', '#F59E0B', '#EF4444']}>
              {loading ? t('common.loading') : t('auth.submit_login')}
            </PrimaryButton>
          </form>
        </GlassCard>

        <div className="text-center mt-6 flex flex-col gap-3">
          <button
            onClick={() => navigate('/register')}
            className="text-white/70 hover:text-white text-sm"
            style={{ fontFamily: 'Cairo', fontWeight: 700 }}
          >
            {t('auth.no_account')}
          </button>
          <div className="flex flex-col gap-2 items-center mt-1">
            <p className="text-white/55 text-xs" style={{ fontFamily: 'Cairo' }}>
              معاينة فوريّة بدور مختلف:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {(
                [
                  { role: 'student', label: 'تلميذ' },
                  { role: 'parent', label: 'وليّ أمر' },
                  { role: 'teacher', label: 'أستاذ' },
                  { role: 'admin', label: 'مسؤول' }
                ] as const
              ).map(({ role, label }) => (
                <button
                  key={role}
                  onClick={() => startDemo(role)}
                  className="rounded-full px-3.5 py-1.5 text-xs"
                  style={{
                    fontFamily: 'Cairo, sans-serif',
                    fontWeight: 800,
                    background:
                      role === 'student'
                        ? 'linear-gradient(135deg, rgba(251,191,36,0.16), rgba(239,68,68,0.14))'
                        : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${role === 'student' ? 'rgba(245,158,11,0.45)' : 'rgba(255,255,255,0.15)'}`,
                    color: 'white'
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Field({ icon, placeholder, value, type = 'text', onChange }: { icon: React.ReactNode; placeholder: string; value: string; type?: string; onChange: (v: string) => void }) {
  return (
    <label
      className="flex items-center gap-3 px-4 py-3 rounded-2xl"
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)'
      }}
    >
      {icon}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent outline-none text-white placeholder-white/40"
        style={{ fontFamily: 'Cairo', fontSize: 15 }}
      />
    </label>
  );
}
