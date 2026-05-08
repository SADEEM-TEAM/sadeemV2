import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Sparkles, Bell } from 'lucide-react';

import { LandingBackdrop } from '../../components/landing/LandingBackdrop';
import { GlassPanel } from '../../components/data/Charts';

export function MessagesScreen() {
  return (
    <div className="relative min-h-[60vh]">
      <LandingBackdrop />
      <div className="relative z-10">
        <header className="mb-6">
          <h1 className="text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 900, fontSize: 28 }}>
            الرسائل
          </h1>
          <p className="text-white/65" style={{ fontFamily: 'Cairo, sans-serif', fontSize: 14 }}>
            تواصل مباشر بين التلاميذ والأساتذة
          </p>
        </header>

        <GlassPanel accent="#A78BFA" className="text-center py-14">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block"
          >
            <div
              className="w-20 h-20 mx-auto rounded-3xl grid place-items-center"
              style={{
                background: 'linear-gradient(135deg, rgba(167,139,250,0.25), rgba(96,165,250,0.18))',
                border: '1.5px solid rgba(167,139,250,0.5)',
                boxShadow: '0 18px 50px rgba(167,139,250,0.3)'
              }}
            >
              <MessageSquare size={36} className="text-violet-300" />
            </div>
          </motion.div>

          <span
            className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs mt-5"
            style={{
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #FBBF24, #F59E0B, #EF4444)',
              color: 'white',
              boxShadow: '0 8px 22px rgba(245,158,11,0.4)'
            }}
          >
            <Sparkles size={11} />
            قريباً
          </span>

          <h2 className="text-white mt-5" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 900, fontSize: 24 }}>
            نظام مراسلات في الطّريق
          </h2>
          <p className="text-white/70 max-w-[460px] mx-auto mt-3" style={{ fontFamily: 'Cairo, sans-serif', fontSize: 15, lineHeight: 1.85 }}>
            قريباً ستتمكّن من التحدّث مباشرة مع الأستاذ، إرسال أسئلة، وتلقّي ملاحظات شخصية حول
            تقدّمك في الدّروس.
          </p>

          <div className="mt-6 flex items-center justify-center">
            <button
              className="rounded-full px-5 py-2.5 text-sm inline-flex items-center gap-2"
              style={{
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 800,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'white'
              }}
            >
              <Bell size={14} />
              نبّهني عند الإطلاق
            </button>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
