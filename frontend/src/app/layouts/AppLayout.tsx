import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { LogOut, Heart, Flame, Star } from 'lucide-react';

import { useAuth } from '@/store/auth.store';
import { BrandLogo } from '../components/ui/BrandLogo';
import { useScrollPast } from '../hooks/useScrollPast';
import type { NavItem } from './navConfig';

interface AppLayoutProps {
  nav: NavItem[];
  showStudentStats?: boolean;
}

export function AppLayout({ nav, showStudentStats = false }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const scrolled = useScrollPast(24);

  const onSignOut = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="relative min-h-screen w-full text-white" dir="rtl">
      {/* Desktop floating vertical nav pill */}
      <aside
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="hidden md:flex fixed end-4 top-1/2 -translate-y-1/2 z-40"
        style={{ insetInlineEnd: 16 }}
      >
        <motion.div
          animate={{ width: hovered ? 240 : 64 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className="rounded-2xl flex flex-col py-2 px-2 gap-1"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.10)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            boxShadow: '0 16px 50px rgba(0,0,0,0.45)'
          }}
        >
          {nav.map(({ to, icon: Icon, labelAr, end, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `relative flex items-center gap-3 rounded-xl px-3 py-3 transition-colors overflow-hidden ${
                  isActive ? 'text-white' : 'text-white/65 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="navActive"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(251,191,36,0.22), rgba(239,68,68,0.18))',
                        border: '1px solid rgba(245,158,11,0.45)'
                      }}
                    />
                  )}
                  <Icon size={20} className="relative z-10 flex-shrink-0" />
                  <motion.span
                    initial={false}
                    animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -6 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10 text-sm whitespace-nowrap flex-1"
                    style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
                  >
                    {labelAr}
                  </motion.span>
                  {badge === 'soon' && hovered && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative z-10 text-[10px] rounded-full px-1.5 py-0.5"
                      style={{
                        fontFamily: 'Cairo, sans-serif',
                        fontWeight: 800,
                        background: 'rgba(167,139,250,0.18)',
                        color: '#C4B5FD',
                        border: '1px solid rgba(167,139,250,0.4)'
                      }}
                    >
                      قريباً
                    </motion.span>
                  )}
                </>
              )}
            </NavLink>
          ))}

          <div className="my-1 h-px bg-white/10 mx-1" />

          <button
            onClick={onSignOut}
            className="relative flex items-center gap-3 rounded-xl px-3 py-3 text-white/55 hover:text-rose-300 hover:bg-rose-500/10 transition-colors overflow-hidden"
          >
            <LogOut size={20} className="flex-shrink-0" />
            <motion.span
              initial={false}
              animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -6 }}
              transition={{ duration: 0.2 }}
              className="text-sm whitespace-nowrap"
              style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
            >
              تسجيل الخروج
            </motion.span>
          </button>
        </motion.div>
      </aside>

      {/* Top status bar */}
      <header className="fixed top-0 inset-x-0 z-30">
        <motion.div
          aria-hidden
          className="absolute inset-0 backdrop-blur-xl"
          initial={false}
          animate={{ opacity: scrolled ? 1 : 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          style={{
            background: 'linear-gradient(180deg, rgba(8,4,28,0.82) 0%, rgba(8,4,28,0.55) 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            WebkitBackdropFilter: 'blur(18px)',
            backdropFilter: 'blur(18px)'
          }}
        />
        <div className="relative px-4 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo size={42} />
            {user?.role && user.role !== 'student' && (
              <span
                className="rounded-full px-2.5 py-0.5 text-[11px]"
                style={{
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 800,
                  background: 'rgba(245,158,11,0.15)',
                  color: '#FBBF24',
                  border: '1px solid rgba(245,158,11,0.4)'
                }}
              >
                {ROLE_LABEL[user.role]}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 ms-auto">
            {showStudentStats ? (
              <>
                <Stat icon={<Flame size={14} className="text-orange-400" />} value={user?.streak ?? 0} accent="#FB923C" />
                <Stat icon={<Star size={14} className="text-yellow-300" fill="#FACC15" />} value={user?.xp ?? 0} accent="#FACC15" />
                <Stat icon={<Heart size={14} className="text-rose-400" fill="#FB7185" />} value={user?.hearts ?? 0} accent="#FB7185" />
              </>
            ) : (
              <span className="text-white/75 text-sm" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>
                {user?.username}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 md:ms-[96px] md:me-4 pb-24 md:pb-10 pt-20 px-4 md:px-8 max-w-[1280px] mx-auto">
        <Outlet />
      </main>

      {/* Mobile bottom tab bar */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 px-4 pb-3 pt-2"
        style={{
          background: 'linear-gradient(0deg, rgba(8,4,28,0.95) 0%, rgba(8,4,28,0.4) 100%)',
          backdropFilter: 'blur(18px)'
        }}
      >
        <div
          className="rounded-2xl flex items-center justify-around py-2 px-2"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          {nav.slice(0, 4).map(({ to, icon: Icon, labelAr, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${
                  isActive ? 'text-white' : 'text-white/55'
                }`
              }
            >
              <Icon size={20} />
              <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: 10, fontWeight: 700 }}>
                {labelAr}
              </span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}

const ROLE_LABEL: Record<string, string> = {
  teacher: 'أستاذ',
  parent: 'وليّ أمر',
  admin: 'مسؤول'
};

function Stat({ icon, value, accent }: { icon: React.ReactNode; value: number; accent: string }) {
  return (
    <div
      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 backdrop-blur-md"
      style={{
        background: 'rgba(255,255,255,0.08)',
        border: `1px solid ${accent}33`
      }}
    >
      {icon}
      <span style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: 13, color: accent }}>
        {value}
      </span>
    </div>
  );
}
