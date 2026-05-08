import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { GraduationCap, BookOpen, Users, ArrowRight, Info } from 'lucide-react';

import { GlassCard } from '../../components/ui/GlassCard';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { BrandLogo } from '../../components/ui/BrandLogo';
import type { Role } from '@/lib/types';

const BRAND_GRADIENT: [string, string, string] = ['#FBBF24', '#F59E0B', '#EF4444'];
const BRAND_ACCENT = '#F59E0B';

type RoleKey = Extract<Role, 'student' | 'teacher' | 'parent'>;

const ROLES: { key: RoleKey; icon: React.ComponentType<any> }[] = [
  { key: 'student', icon: GraduationCap },
  { key: 'teacher', icon: BookOpen },
  { key: 'parent', icon: Users }
];

export function RoleSelectScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<RoleKey>('student');

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-6 py-16">
      <div className="relative z-10 w-full max-w-[920px] flex flex-col items-center text-center gap-10">
        <BrandLogo size={48} />

        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white"
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 900, fontSize: 30 }}
          >
            {t('role.title')}
          </motion.h1>
          <p className="text-white/65 mt-2" style={{ fontFamily: 'Cairo', fontSize: 15 }}>
            {t('role.sub')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full">
          {ROLES.map(({ key, icon: Icon }, i) => {
            const active = selected === key;
            return (
              <motion.button
                key={key}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelected(key)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i }}
                className="text-start"
              >
                <GlassCard accent={active ? BRAND_ACCENT : undefined} glow={active} className="p-7 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-2xl grid place-items-center"
                      style={{
                        background: active
                          ? `linear-gradient(135deg, ${BRAND_GRADIENT[0]}, ${BRAND_GRADIENT[1]}, ${BRAND_GRADIENT[2]})`
                          : 'rgba(255,255,255,0.06)',
                        border: active ? 'none' : '1px solid rgba(255,255,255,0.10)'
                      }}
                    >
                      <Icon size={24} className="text-white" />
                    </div>
                    <h2 style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: 20, color: 'white' }}>
                      {t(`role.${key}`)}
                    </h2>
                    <div
                      className="ms-auto w-5 h-5 rounded-full border-2 grid place-items-center"
                      style={{ borderColor: active ? BRAND_ACCENT : 'rgba(255,255,255,0.25)' }}
                    >
                      {active && (
                        <motion.div
                          layoutId="role-dot"
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ background: BRAND_ACCENT }}
                        />
                      )}
                    </div>
                  </div>
                  <p style={{ fontFamily: 'Cairo, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
                    {t(`role.${key}_desc`)}
                  </p>
                </GlassCard>
              </motion.button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-white/50" style={{ fontFamily: 'Cairo', fontSize: 12 }}>
          <Info size={14} />
          {t('role.admin_note')}
        </div>

        <PrimaryButton
          onClick={() => navigate(`/register?role=${selected}`)}
          gradient={BRAND_GRADIENT}
        >
          <span className="inline-flex items-center gap-2">
            {t('onboarding.next')}
            <ArrowRight size={18} className="-scale-x-100" />
          </span>
        </PrimaryButton>
      </div>
    </div>
  );
}
