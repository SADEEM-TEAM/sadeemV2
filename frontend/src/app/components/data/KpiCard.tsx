import React from 'react';
import { motion } from 'motion/react';

interface KpiCardProps {
  icon: React.ReactNode;
  labelAr: string;
  value: string | number;
  trendAr?: string;
  trendKind?: 'up' | 'down' | 'neutral';
  accent?: string;
  className?: string;
}

const TREND_COLOR: Record<string, string> = {
  up: '#34D399',
  down: '#F87171',
  neutral: 'rgba(255,255,255,0.55)'
};

export function KpiCard({
  icon,
  labelAr,
  value,
  trendAr,
  trendKind = 'neutral',
  accent = '#F59E0B',
  className = ''
}: KpiCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`relative rounded-2xl p-5 overflow-hidden ${className}`}
      style={{
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
        border: `1px solid ${accent}33`,
        backdropFilter: 'blur(14px)',
        boxShadow: `0 16px 40px rgba(0,0,0,0.35), 0 0 28px ${accent}22`
      }}
    >
      <div
        aria-hidden
        className="absolute -top-8 -end-8 w-32 h-32 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${accent}55 0%, transparent 70%)`,
          filter: 'blur(20px)',
          opacity: 0.55
        }}
      />
      <div className="relative flex items-start gap-3">
        <div
          className="w-11 h-11 rounded-2xl grid place-items-center flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${accent}, ${accent}aa)`,
            boxShadow: `0 8px 22px ${accent}55`
          }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="text-white/65 truncate"
            style={{ fontFamily: 'Cairo, sans-serif', fontSize: 12, fontWeight: 700 }}
          >
            {labelAr}
          </p>
          <p
            className="text-white mt-1"
            style={{ fontFamily: 'Cairo, sans-serif', fontSize: 24, fontWeight: 900, lineHeight: 1.1 }}
          >
            {value}
          </p>
          {trendAr && (
            <p
              className="mt-1"
              style={{
                fontFamily: 'Cairo, sans-serif',
                fontSize: 11,
                fontWeight: 800,
                color: TREND_COLOR[trendKind]
              }}
            >
              {trendAr}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
