import React, { useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, useScroll, useTransform } from 'motion/react';
import { useTranslation } from 'react-i18next';
import {
  Rocket,
  Sparkles,
  ArrowDown,
  Scroll,
  Sigma,
  Code2,
  Heart,
  Star,
  Flame,
  GraduationCap,
  Gamepad2,
  BookOpen
} from 'lucide-react';

import { LandingBackdrop } from '../../components/landing/LandingBackdrop';
import { MagneticCta } from '../../components/landing/MagneticCta';
import { TiltCard } from '../../components/landing/TiltCard';
import { BrandLogo } from '../../components/ui/BrandLogo';
import brandLogo from '@/assets/brand_logo.svg';
import mascotHistory from '@/assets/mascot_blue_celebrating.svg';
import mascotMath from '@/assets/mascot_blue.svg';
import mascotCoding from '@/assets/mascot_blue_excited.svg';
import mascotIslamic from '@/assets/mascot_islamic.svg';
import { useScrollPast } from '../../hooks/useScrollPast';
import { useAuth } from '@/store/auth.store';
import { homePathForRole } from '../../layouts/navConfig';
import type { CourseTopic } from '@/lib/types';

interface TopicCard {
  topic: CourseTopic | 'islamic';
  titleAr: string;
  descAr: string;
  icon: React.ComponentType<any>;
  accent: string;
  gradient: [string, string, string];
  motifs: string[];
  mascot: string;
}

const TOPICS: TopicCard[] = [
  {
    topic: 'history',
    titleAr: 'تاريخ الجزائر',
    descAr: 'من نوميديا إلى 8 ماي 1945، عش التاريخ كما لم يُروَ من قبل.',
    icon: Scroll,
    accent: '#F59E0B',
    gradient: ['#FBBF24', '#F59E0B', '#B45309'],
    motifs: ['ⵣ', '★', '◐'],
    mascot: mascotHistory
  },
  {
    topic: 'math',
    titleAr: 'الرياضيات',
    descAr: 'من الأعداد إلى الجبر، اكتشف الجمال الخفيّ في الأرقام.',
    icon: Sigma,
    accent: '#38BDF8',
    gradient: ['#7DD3FC', '#38BDF8', '#1E40AF'],
    motifs: ['π', '∑', '∞'],
    mascot: mascotMath
  },
  {
    topic: 'coding',
    titleAr: 'البرمجة',
    descAr: 'فكّر مثل المبرمج، حلّ المشكلات وابنِ مستقبلك الرقمي.',
    icon: Code2,
    accent: '#34D399',
    gradient: ['#6EE7B7', '#34D399', '#047857'],
    motifs: ['<>', '{}', 'fn'],
    mascot: mascotCoding
  },
  {
    topic: 'islamic',
    titleAr: 'الإسلاميّات',
    descAr: 'من أركان الإسلام إلى السّيرة النبوية، تعمّق في معاني دينك بطريقة تفاعلية.',
    icon: BookOpen,
    accent: '#14B8A6',
    gradient: ['#5EEAD4', '#14B8A6', '#0F766E'],
    motifs: ['☪', '۞', '✦'],
    mascot: mascotIslamic
  }
];

export function LandingScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const enterDemoMode = useAuth((s) => s.enterDemoMode);
  const scrolled = useScrollPast(24);
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const startDemo = async () => {
    const u = await enterDemoMode('student');
    navigate(homePathForRole(u.role));
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden text-white">
      <LandingBackdrop />

      {/* Top bar */}
      <header className="fixed top-0 inset-x-0 z-30">
        <motion.div
          aria-hidden
          className="absolute inset-0 backdrop-blur-xl"
          initial={false}
          animate={{ opacity: scrolled ? 1 : 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          style={{
            background:
              'linear-gradient(180deg, rgba(8,4,28,0.82) 0%, rgba(8,4,28,0.55) 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            WebkitBackdropFilter: 'blur(18px)',
            backdropFilter: 'blur(18px)'
          }}
        />
        <div className="relative flex items-center justify-between px-6 md:px-10 py-4">
          <BrandLogo size={36} />
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-white/75 hover:text-white text-sm rounded-full px-4 py-2 transition-colors"
              style={{ fontFamily: 'Cairo', fontWeight: 700 }}
            >
              تسجيل الدخول
            </button>
            <button
              onClick={() => navigate('/role')}
              className="rounded-full px-5 py-2 text-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(167,139,250,0.25), rgba(96,165,250,0.25))',
                border: '1px solid rgba(167,139,250,0.4)',
                fontFamily: 'Cairo',
                fontWeight: 800,
                color: 'white'
              }}
            >
              ابدأ الآن
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <motion.section
        ref={heroRef}
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-20"
      >
        {/* Centered hero logo (no flanking mascots — the SVG already includes them) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, type: 'spring', stiffness: 130, damping: 18 }}
          className="relative"
          style={{ filter: 'drop-shadow(0 20px 60px rgba(251,191,36,0.4))' }}
        >
          <img
            src={brandLogo}
            alt="سديم"
            draggable={false}
            className="block select-none mx-auto"
            style={{
              width: 'clamp(260px, 42vw, 480px)',
              height: 'auto',
              userSelect: 'none',
              pointerEvents: 'none'
            }}
          />
          {/* Glowing underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.9, ease: 'easeOut' }}
            className="h-1.5 rounded-full mx-auto mt-2"
            style={{
              width: '60%',
              background: 'linear-gradient(90deg, transparent, #FBBF24, #EF4444, transparent)',
              boxShadow: '0 0 30px rgba(251,191,36,0.7)',
              transformOrigin: 'center'
            }}
          />
        </motion.div>

        {/* Tagline */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-center mt-6 max-w-[820px]"
          style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: 'clamp(22px, 3vw, 32px)', lineHeight: 1.4 }}
        >
          مثل سديمٍ تتشكّل فيه النجوم،
          <br className="hidden sm:block" />
          <span
            style={{
              background: 'linear-gradient(90deg, #A78BFA, #60A5FA, #34D399)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            هنا تتشكّل عقول الجزائر.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="text-center mt-5 text-white/80 max-w-[640px]"
          style={{ fontFamily: 'Cairo', fontSize: 17, lineHeight: 1.85 }}
        >
          منصّة تعليمية تفاعلية تمزج بين متعة الألعاب وعمق المعرفة، مصمّمة خصّيصاً لأطفال وشباب الجزائر — من تاريخ بلدنا إلى الرياضيات والبرمجة.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <MagneticCta onClick={() => navigate('/role')}>
            <Rocket size={20} />
            ابدأ مغامرتك الآن
          </MagneticCta>
          <button
            onClick={startDemo}
            className="rounded-full px-7 py-4 text-white/95 hover:text-white"
            style={{
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 800,
              fontSize: 16,
              background:
                'linear-gradient(135deg, rgba(167,139,250,0.22), rgba(96,165,250,0.18))',
              border: '1px solid rgba(167,139,250,0.45)',
              backdropFilter: 'blur(12px)'
            }}
          >
            <span className="inline-flex items-center gap-2">
              <Sparkles size={16} className="text-yellow-300" />
              ابدأ بدون حساب — وضع المعاينة
            </span>
          </button>
        </motion.div>

        {/* Trust line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-12 flex items-center gap-6 text-white/65"
        >
          <Trust icon={<GraduationCap size={16} className="text-violet-300" />} text="معتمد للتعليم الابتدائي والمتوسط" />
          <span className="hidden md:inline-block w-px h-5 bg-white/15" />
          <Trust icon={<Heart size={16} className="text-rose-300" />} text="من صنع جزائريين، للجزائر" />
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1.4, opacity: { duration: 0.5 }, y: { duration: 1.6, repeat: Infinity } }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/55 text-xs flex flex-col items-center gap-1"
          style={{ fontFamily: 'Cairo' }}
        >
          <span>انزل لتكتشف</span>
          <ArrowDown size={14} />
        </motion.div>
      </motion.section>

      {/* TOPICS */}
      <section id="topics" className="relative z-10 px-6 md:px-10 py-24">
        <SectionHeader
          eyebrow="ما الذي ستتعلّمه"
          title="ثلاث عوالم. حكاية واحدة."
          desc="كل مادّة معاً عالم بصري متكامل: مؤثّرات، رسوم، ومراحل تتفتّح كلّما تقدّمت."
        />

        <div className="mt-28 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1500px] mx-auto">
          {TOPICS.map((topic, i) => (
            <motion.div
              key={topic.topic}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
            >
              <TopicShowcase card={topic} onClick={() => navigate('/role')} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative z-10 px-6 md:px-10 py-24">
        <SectionHeader
          eyebrow="كيف تعمل"
          title="ثلاث خطوات لتنطلق"
          desc="بسيط بقدر ما هو ممتع. اختر دورك، ادرس، ثم العب لتترسّخ المعرفة."
        />

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[1100px] mx-auto">
          <Step
            n={1}
            icon={<GraduationCap size={28} className="text-violet-300" />}
            accent="#A78BFA"
            title="اختر دورك وأنشئ حسابك"
            desc="تلميذ أم أستاذ — كلّ تجربة معدّة لمستوى الاستخدام والمحتوى المناسب."
          />
          <Step
            n={2}
            icon={<BookOpen size={28} className="text-cyan-300" />}
            accent="#38BDF8"
            title="ادرس بدروس بصريّة قصيرة"
            desc="نصوص، رسوم، واقتباسات. لا حشو ولا ملل، كل دقيقة مدروسة."
          />
          <Step
            n={3}
            icon={<Gamepad2 size={28} className="text-emerald-300" />}
            accent="#34D399"
            title="العب لتترسّخ المعرفة"
            desc="ستّة أنواع من المهام: من الأسئلة إلى لعبة الدبابات الكتابيّة."
          />
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="relative z-10 px-6 md:px-10 py-12">
        <div
          className="max-w-[1100px] mx-auto rounded-3xl px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6"
          style={{
            background:
              'linear-gradient(135deg, rgba(167,139,250,0.10) 0%, rgba(96,165,250,0.06) 50%, rgba(244,114,182,0.10) 100%)',
            border: '1px solid rgba(255,255,255,0.10)',
            backdropFilter: 'blur(14px)'
          }}
        >
          <Stat icon={<Star size={20} fill="#FACC15" className="text-yellow-300" />} value="6" label="ألعاب تفاعليّة" />
          <Stat icon={<Scroll size={20} className="text-orange-300" />} value="3" label="مواد رئيسيّة" />
          <Stat icon={<Flame size={20} className="text-rose-300" />} value="∞" label="مغامرة بلا نهاية" />
          <Stat icon={<Heart size={20} fill="#FB7185" className="text-rose-400" />} value="100%" label="بالعربية" />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative z-10 px-6 md:px-10 py-24 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto"
          style={{ fontFamily: 'Cairo', fontWeight: 900, fontSize: 'clamp(30px, 5vw, 56px)', lineHeight: 1.2, maxWidth: 880 }}
        >
          جاهز لتنطلق في
          <span
            style={{
              background: 'linear-gradient(135deg, #FBBF24, #EF4444)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              padding: '0 12px'
            }}
          >
            رحلتك الأولى؟
          </span>
        </motion.h2>
        <p className="text-white/70 max-w-[560px] mx-auto mt-4" style={{ fontFamily: 'Cairo', fontSize: 17 }}>
          أنشئ حسابك مجّاناً وابدأ بأوّل درس عن 8 ماي 1945 — في أقلّ من دقيقة.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <MagneticCta onClick={() => navigate('/role')}>
            <Rocket size={20} />
            أنشئ حسابك مجّاناً
          </MagneticCta>
          <button
            onClick={() => navigate('/login')}
            className="text-white/75 hover:text-white"
            style={{ fontFamily: 'Cairo', fontWeight: 800, fontSize: 15 }}
          >
            لديك حساب؟ تسجيل الدخول
          </button>
        </div>
      </section>

      {/* B2B CONTACT STRIP */}
      <section id="b2b" className="relative z-10 px-6 md:px-10 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-[1100px] mx-auto rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 text-center md:text-start"
          style={{
            background:
              'linear-gradient(135deg, rgba(251,191,36,0.10) 0%, rgba(239,68,68,0.06) 100%)',
            border: '1px solid rgba(245,158,11,0.25)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)'
          }}
        >
          <div className="w-14 h-14 rounded-2xl grid place-items-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #FBBF24, #F59E0B, #EF4444)' }}>
            <GraduationCap size={26} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white" style={{ fontFamily: 'Cairo', fontWeight: 900, fontSize: 22 }}>
              {t('footer.b2b_title')}
            </h3>
            <p className="text-white/75 mt-1.5" style={{ fontFamily: 'Cairo', fontSize: 15, lineHeight: 1.8 }}>
              {t('footer.b2b_sub')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a
              href="mailto:b2b@sadeen.dz"
              className="rounded-full px-5 py-3 text-sm"
              style={{
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #FBBF24, #F59E0B, #EF4444)',
                color: 'white',
                boxShadow: '0 12px 30px rgba(245,158,11,0.35)'
              }}
            >
              {t('footer.contact_us')}
            </a>
            <a
              href="mailto:hello@sadeen.dz"
              className="text-white/75 hover:text-white text-sm"
              style={{ fontFamily: 'Cairo', fontWeight: 700 }}
            >
              {t('footer.email_us')}
            </a>
          </div>
        </motion.div>
      </section>

      <footer className="relative z-10 px-6 md:px-10 py-10 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-3">
          <BrandLogo size={26} />
          <span className="text-white/55 text-sm" style={{ fontFamily: 'Cairo' }}>
            © {new Date().getFullYear()} — {t('footer.made_in')}
          </span>
        </div>
        <div className="flex items-center gap-5 text-white/55 text-sm" style={{ fontFamily: 'Cairo' }}>
          <a href="#" className="hover:text-white">الخصوصيّة</a>
          <a href="#" className="hover:text-white">الشّروط</a>
          <a href="#b2b" className="hover:text-white">{t('footer.contact_us')}</a>
        </div>
      </footer>
    </div>
  );
}

function SectionHeader({ eyebrow, title, desc }: { eyebrow: string; title: string; desc: string }) {
  return (
    <div className="text-center max-w-[760px] mx-auto">
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.85 }}
        viewport={{ once: true }}
        className="inline-block rounded-full px-3 py-1 text-xs"
        style={{
          fontFamily: 'Cairo',
          fontWeight: 800,
          background: 'rgba(167,139,250,0.15)',
          color: '#C4B5FD',
          border: '1px solid rgba(167,139,250,0.3)'
        }}
      >
        {eyebrow}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-white mt-4"
        style={{ fontFamily: 'Cairo', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.25 }}
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.75 }}
        viewport={{ once: true }}
        className="text-white/75 mt-3"
        style={{ fontFamily: 'Cairo', fontSize: 16, lineHeight: 1.85 }}
      >
        {desc}
      </motion.p>
    </div>
  );
}

function TopicShowcase({ card, onClick }: { card: TopicCard; onClick: () => void }) {
  return (
    <div className="relative pt-28 h-full flex flex-col">
      {/* Mascot floats ABOVE the card, perfectly centered.
          Uses a 0-height flex wrapper so framer-motion's animate.y can't fight the centering. */}
      <div
        className="absolute pointer-events-none select-none"
        style={{
          top: 0,
          left: 0,
          right: 0,
          height: 0,
          display: 'flex',
          justifyContent: 'center',
          zIndex: 2
        }}
      >
        <motion.img
          src={card.mascot}
          alt=""
          aria-hidden
          draggable={false}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 200,
            height: 200,
            objectFit: 'contain',
            filter: `drop-shadow(0 18px 36px ${card.accent}66) drop-shadow(0 0 28px ${card.accent}55)`
          }}
        />
      </div>

      <TiltCard
        accent={card.accent}
        onClick={onClick}
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 100%)',
          borderColor: `${card.accent}40`,
          boxShadow: `0 24px 80px rgba(0,0,0,0.45), 0 0 30px ${card.accent}22, inset 0 1px 0 rgba(255,255,255,0.18)`,
          minHeight: 320
        }}
        className="p-7 pt-20 flex-1 overflow-hidden flex flex-col items-center text-center"
      >
        {/* Floating motif corner decoration */}
        <div
          aria-hidden
          className="absolute -top-6 -end-6 w-40 h-40 pointer-events-none opacity-30"
          style={{
            background: `radial-gradient(circle, ${card.accent}88 0%, transparent 70%)`,
            filter: 'blur(20px)'
          }}
        />
        {card.motifs.map((m, i) => (
          <span
            key={i}
            aria-hidden
            className="absolute select-none pointer-events-none"
            style={{
              bottom: 18 + i * 22,
              insetInlineEnd: 18 + i * 14,
              color: `${card.accent}33`,
              fontFamily: 'Cairo',
              fontWeight: 800,
              fontSize: 16 + i * 3,
              transform: `rotate(${(i - 1) * 8}deg)`,
              opacity: 0.5
            }}
          >
            {m}
          </span>
        ))}

        <h3
          className="text-white mb-2"
          style={{ fontFamily: 'Cairo', fontWeight: 900, fontSize: 24 }}
        >
        {card.titleAr}
      </h3>
      <p className="text-white/75" style={{ fontFamily: 'Cairo', fontSize: 14.5, lineHeight: 1.85 }}>
        {card.descAr}
      </p>

        <div className="mt-6 inline-flex items-center gap-2 text-sm" style={{ color: card.accent, fontFamily: 'Cairo', fontWeight: 800 }}>
          استكشف
          <span style={{ fontSize: 16 }}>←</span>
        </div>
      </TiltCard>
    </div>
  );
}

function Step({
  n,
  icon,
  accent,
  title,
  desc
}: {
  n: number;
  icon: React.ReactNode;
  accent: string;
  title: string;
  desc: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
      className="relative rounded-3xl p-7"
      style={{
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
        border: `1px solid ${accent}33`,
        backdropFilter: 'blur(14px)'
      }}
    >
      <span
        className="absolute -top-5 start-7 w-10 h-10 rounded-full grid place-items-center"
        style={{
          background: `linear-gradient(135deg, ${accent}, ${accent}99)`,
          boxShadow: `0 8px 24px ${accent}55`,
          fontFamily: 'Cairo',
          fontWeight: 900,
          color: 'white',
          fontSize: 16
        }}
      >
        {n}
      </span>
      <div className="mb-4">{icon}</div>
      <h4 className="text-white mb-2" style={{ fontFamily: 'Cairo', fontWeight: 800, fontSize: 19 }}>
        {title}
      </h4>
      <p className="text-white/70" style={{ fontFamily: 'Cairo', fontSize: 14.5, lineHeight: 1.8 }}>
        {desc}
      </p>
    </motion.div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-1.5">
      <div className="flex items-center gap-2">
        {icon}
        <span style={{ fontFamily: 'Cairo', fontWeight: 900, fontSize: 28, color: 'white' }}>
          {value}
        </span>
      </div>
      <span style={{ fontFamily: 'Cairo', fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{label}</span>
    </div>
  );
}

function Trust({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm" style={{ fontFamily: 'Cairo', fontWeight: 700 }}>
      {icon}
      {text}
    </span>
  );
}
