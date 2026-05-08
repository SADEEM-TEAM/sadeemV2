import React, { useEffect, useState } from 'react';
import { CreditCard, Check, Star, Sparkles, Download } from 'lucide-react';
import { motion } from 'motion/react';

import { LandingBackdrop } from '../../components/landing/LandingBackdrop';
import { GlassPanel, PanelHeader } from '../../components/data/Charts';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { api } from '@/lib/api';

interface BillingData {
  plan: string;
  seats: number;
  used: number;
  monthlyAmount: number;
  currency: string;
  nextBillingDate: string;
  paymentMethod: { brand: string; last4: string; expires: string };
  history: Array<{ id: string; date: string; amount: number; status: string }>;
  plans: Array<{
    id: string;
    name: string;
    priceMonthly: number;
    seats: number;
    features: string[];
    recommended?: boolean;
  }>;
}

export function ParentBillingScreen() {
  const [data, setData] = useState<BillingData | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get('/parent/billing').then((r) => setData(r.data.data));
  }, []);

  const switchPlan = async (planId: string) => {
    setBusy(true);
    try {
      await api.post('/parent/billing/plan', { planId });
    } finally {
      setBusy(false);
    }
  };

  if (!data) {
    return (
      <div className="relative">
        <LandingBackdrop />
        <p className="relative z-10 text-white/55" style={{ fontFamily: 'Cairo' }}>
          جارٍ التحميل…
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <LandingBackdrop />
      <div className="relative z-10">
        <header className="mb-6">
          <h1 className="text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 900, fontSize: 28 }}>
            الاشتراك والفواتير
          </h1>
          <p className="text-white/65" style={{ fontFamily: 'Cairo, sans-serif', fontSize: 14 }}>
            إدارة باقتك وطرق الدفع والفواتير السابقة
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Current plan summary */}
          <GlassPanel accent="#FBBF24" className="lg:col-span-2">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
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
                  باقتك الحالية
                </span>
                <h2 className="text-white mt-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 900, fontSize: 24 }}>
                  {data.plan}
                </h2>
                <p className="text-white/65 mt-1" style={{ fontFamily: 'Cairo, sans-serif', fontSize: 13 }}>
                  {data.used} من {data.seats} مقاعد مستعملة
                </p>
              </div>
              <div className="text-end">
                <p style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 900, fontSize: 30, color: '#FBBF24', lineHeight: 1 }}>
                  {data.monthlyAmount.toLocaleString('ar-EG')}
                </p>
                <p className="text-white/55" style={{ fontFamily: 'Cairo, sans-serif', fontSize: 12 }}>
                  {data.currency} / شهرياً
                </p>
                <p className="text-white/65 mt-2" style={{ fontFamily: 'Cairo, sans-serif', fontSize: 11 }}>
                  الدفعة القادمة: {data.nextBillingDate}
                </p>
              </div>
            </div>
          </GlassPanel>

          {/* Payment method */}
          <GlassPanel accent="#A78BFA">
            <PanelHeader titleAr="طريقة الدفع" />
            <div
              className="rounded-2xl p-4 mb-3 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #1E1B4B 0%, #4C1D95 60%, #831843 100%)',
                border: '1px solid rgba(167,139,250,0.45)'
              }}
            >
              <div
                aria-hidden
                className="absolute -top-10 -end-10 w-40 h-40 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.35) 0%, transparent 70%)', filter: 'blur(20px)' }}
              />
              <div className="relative flex items-center justify-between">
                <CreditCard size={26} className="text-white/90" />
                <span style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 900, color: '#FBBF24' }}>
                  {data.paymentMethod.brand}
                </span>
              </div>
              <p className="relative text-white mt-6 tracking-widest" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: 18 }}>
                •••• •••• •••• {data.paymentMethod.last4}
              </p>
              <p className="relative text-white/65 mt-2" style={{ fontFamily: 'Cairo, sans-serif', fontSize: 12 }}>
                ينتهي {data.paymentMethod.expires}
              </p>
            </div>
            <button
              className="w-full rounded-xl px-4 py-2.5 text-sm"
              style={{
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 800,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'white'
              }}
            >
              تحديث طريقة الدفع
            </button>
          </GlassPanel>
        </div>

        {/* Plans */}
        <h2 className="text-white mt-8 mb-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: 18 }}>
          غيّر باقتك
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.plans.map((p) => {
            const current = p.name === data.plan;
            const recommended = p.recommended;
            return (
              <motion.div
                key={p.id}
                whileHover={{ y: -3 }}
                className="relative rounded-3xl p-6"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
                  border: `1.5px solid ${recommended ? 'rgba(245,158,11,0.6)' : 'rgba(255,255,255,0.10)'}`,
                  backdropFilter: 'blur(14px)',
                  boxShadow: recommended ? '0 24px 60px rgba(245,158,11,0.22)' : '0 16px 40px rgba(0,0,0,0.35)'
                }}
              >
                {recommended && (
                  <span
                    className="absolute -top-3 inset-x-0 mx-auto inline-flex w-max items-center gap-1 rounded-full px-3 py-1 text-[11px]"
                    style={{
                      fontFamily: 'Cairo, sans-serif',
                      fontWeight: 900,
                      background: 'linear-gradient(135deg, #FBBF24, #F59E0B, #EF4444)',
                      color: 'white',
                      boxShadow: '0 8px 22px rgba(245,158,11,0.4)'
                    }}
                  >
                    <Sparkles size={11} />
                    الأكثر اختياراً
                  </span>
                )}
                <h3 style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 900, fontSize: 22, color: 'white' }}>
                  {p.name}
                </h3>
                <p className="text-white/55" style={{ fontFamily: 'Cairo, sans-serif', fontSize: 12 }}>
                  حتى {p.seats} مقاعد
                </p>
                <p className="mt-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 900, fontSize: 30, color: '#FBBF24' }}>
                  {p.priceMonthly.toLocaleString('ar-EG')}
                  <span className="text-white/55 ms-1" style={{ fontSize: 13, fontWeight: 700 }}>
                    {data.currency}/شهر
                  </span>
                </p>
                <ul className="mt-4 flex flex-col gap-2">
                  {p.features.map((f) => (
                    <li key={f} className="inline-flex items-center gap-2 text-white/85" style={{ fontFamily: 'Cairo, sans-serif', fontSize: 13 }}>
                      <Check size={14} className="text-emerald-300 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-5">
                  {current ? (
                    <button
                      disabled
                      className="w-full rounded-xl px-4 py-2.5 text-sm"
                      style={{
                        fontFamily: 'Cairo, sans-serif',
                        fontWeight: 800,
                        background: 'rgba(34,197,94,0.18)',
                        border: '1px solid rgba(34,197,94,0.45)',
                        color: '#34D399'
                      }}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <Check size={14} />
                        باقتك الحالية
                      </span>
                    </button>
                  ) : (
                    <PrimaryButton
                      onClick={() => switchPlan(p.id)}
                      disabled={busy}
                      gradient={['#FBBF24', '#F59E0B', '#EF4444']}
                      fullWidth
                    >
                      اختر هذه الباقة
                    </PrimaryButton>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Billing history */}
        <h2 className="text-white mt-8 mb-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: 18 }}>
          الفواتير السابقة
        </h2>
        <GlassPanel accent="#38BDF8">
          <div className="overflow-hidden rounded-xl">
            <div
              className="grid grid-cols-12 px-4 py-2 text-white/55 text-xs"
              style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, background: 'rgba(255,255,255,0.04)' }}
            >
              <div className="col-span-3">الفاتورة</div>
              <div className="col-span-3">التاريخ</div>
              <div className="col-span-3">المبلغ</div>
              <div className="col-span-2">الحالة</div>
              <div className="col-span-1 text-end">PDF</div>
            </div>
            {data.history.map((h) => (
              <div
                key={h.id}
                className="grid grid-cols-12 items-center px-4 py-3 border-t border-white/8"
              >
                <div className="col-span-3 text-white" style={{ fontFamily: 'Cairo, sans-serif', fontSize: 13 }}>
                  {h.id}
                </div>
                <div className="col-span-3 text-white/65" style={{ fontFamily: 'Cairo, sans-serif', fontSize: 12 }}>
                  {h.date}
                </div>
                <div className="col-span-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, color: '#FBBF24', fontSize: 13 }}>
                  {h.amount.toLocaleString('ar-EG')} {data.currency}
                </div>
                <div className="col-span-2">
                  <span
                    className="rounded-full px-2 py-0.5 text-[11px]"
                    style={{
                      fontFamily: 'Cairo, sans-serif',
                      fontWeight: 800,
                      background: 'rgba(34,197,94,0.18)',
                      color: '#34D399',
                      border: '1px solid rgba(34,197,94,0.45)'
                    }}
                  >
                    مدفوعة
                  </span>
                </div>
                <div className="col-span-1 flex justify-end">
                  <button
                    className="rounded-full w-7 h-7 grid place-items-center text-white/65 hover:text-white"
                    title="تنزيل PDF"
                  >
                    <Download size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
