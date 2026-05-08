import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, User as UserIcon } from 'lucide-react';

import { GlassCard } from '../../components/ui/GlassCard';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { BrandLogo } from '../../components/ui/BrandLogo';
import { useAuth } from '@/store/auth.store';
import type { Role } from '@/lib/types';

export function RegisterScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const register = useAuth((s) => s.register);
  const loading = useAuth((s) => s.loading);

  const rawRole = params.get('role');
  const role: Role = rawRole === 'teacher' || rawRole === 'parent' ? rawRole : 'student';

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register({ username, email, password, role });
      navigate('/onboarding', { replace: true });
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(msg || t('auth.error_generic'));
    }
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
            {t('auth.register_title')}
          </h1>
          <span
            className="rounded-full px-3 py-1 text-xs"
            style={{
              fontFamily: 'Cairo',
              background: 'rgba(245,158,11,0.12)',
              color: '#FBBF24',
              border: '1px solid rgba(245,158,11,0.4)'
            }}
          >
            {t(`role.${role}`)}
          </span>
        </div>

        <GlassCard accent="#F59E0B" className="p-7">
          <form onSubmit={submit} className="flex flex-col gap-4">
            <Field icon={<UserIcon size={18} className="text-white/60" />} placeholder={t('auth.username')} value={username} onChange={setUsername} />
            <Field icon={<Mail size={18} className="text-white/60" />} placeholder={t('auth.email')} value={email} type="email" onChange={setEmail} />
            <Field icon={<Lock size={18} className="text-white/60" />} placeholder={t('auth.password')} value={password} type="password" onChange={setPassword} />

            {error && (
              <p className="text-rose-300 text-sm" style={{ fontFamily: 'Cairo' }}>
                {error}
              </p>
            )}

            <PrimaryButton type="submit" disabled={loading} fullWidth gradient={['#FBBF24', '#F59E0B', '#EF4444']}>
              {loading ? t('common.loading') : t('auth.submit_register')}
            </PrimaryButton>
          </form>
        </GlassCard>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/login')}
            className="text-white/70 hover:text-white text-sm"
            style={{ fontFamily: 'Cairo', fontWeight: 700 }}
          >
            {t('auth.have_account')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function Field({ icon, placeholder, value, type = 'text', onChange }: { icon: React.ReactNode; placeholder: string; value: string; type?: string; onChange: (v: string) => void }) {
  return (
    <label
      className="flex items-center gap-3 px-4 py-3 rounded-2xl"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
    >
      {icon}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        required
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent outline-none text-white placeholder-white/40"
        style={{ fontFamily: 'Cairo', fontSize: 15 }}
      />
    </label>
  );
}
