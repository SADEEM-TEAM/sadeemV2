import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { SpaceBackground } from '../components/SpaceBackground';
import { Mascot } from '../components/Mascot';
import { getWorld, getLevel } from '../data/worlds';
import { useGame } from '../context/GameContext';
import { WorldId } from '../data/worlds';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function LessonScreen() {
  const { worldId, levelId } = useParams<{ worldId: string; levelId: string }>();
  const navigate = useNavigate();
  const { completeLesson, getLevelProgress } = useGame();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [finished, setFinished] = useState(false);
  const [gemsPop, setGemsPop] = useState(false);

  const world = getWorld(worldId as WorldId);
  const level = getLevel(worldId as WorldId, Number(levelId));

  if (!world || !level) return null;

  const slides = level.lesson;
  const progress = getLevelProgress(world.id, level.id);
  const alreadyDone = progress.lessonDone;

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      // Complete lesson
      if (!alreadyDone) {
        completeLesson(world.id, level.id);
        setGemsPop(true);
        setTimeout(() => setGemsPop(false), 2000);
      }
      setFinished(true);
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    } else {
      navigate(`/world/${worldId}`);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <SpaceBackground />

      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${world.glowColor} 0%, transparent 70%)`,
          opacity: 0.3,
          zIndex: 1,
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen max-w-[430px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-6 pb-2">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center active:scale-95"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: 'Nunito', fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
              {world.emoji} {level.title}
            </span>
          </div>
          <div style={{ width: 40 }} />
        </div>

        {/* Progress bar */}
        <div className="px-5 pb-4">
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <div
                key={i}
                className="flex-1 h-2 rounded-full overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: world.color }}
                  initial={{ width: i < currentSlide ? '100%' : '0%' }}
                  animate={{ width: i <= currentSlide ? '100%' : '0%' }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Slide content */}
        <div className="flex-1 flex flex-col px-5">
          <AnimatePresence mode="wait">
            {!finished ? (
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35 }}
                className="flex-1 flex flex-col items-center justify-center gap-6"
              >
                {/* Emoji illustration */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="rounded-3xl flex items-center justify-center"
                  style={{
                    width: 200,
                    height: 200,
                    background: `radial-gradient(circle, ${world.color}22, ${world.color}08)`,
                    border: `2px solid ${world.color}40`,
                    fontSize: 60,
                    boxShadow: `0 0 40px ${world.glowColor}`,
                  }}
                >
                  {slides[currentSlide].emoji}
                </motion.div>

                {/* Text card */}
                <div
                  className="w-full rounded-3xl p-5"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  <h2
                    className="text-white mb-2 text-center"
                    style={{ fontFamily: 'Fredoka One, sans-serif', fontSize: 22 }}
                  >
                    {slides[currentSlide].title}
                  </h2>
                  <p
                    className="text-white/80 text-center leading-relaxed"
                    style={{ fontFamily: 'Nunito, sans-serif', fontSize: 15 }}
                  >
                    {slides[currentSlide].text}
                  </p>
                </div>

                {/* Mascot */}
                <div className="flex items-end gap-3">
                  <Mascot emotion="happy" size={60} />
                  <p className="text-white/60 text-sm" style={{ fontFamily: 'Nunito' }}>
                    Slide {currentSlide + 1} of {slides.length}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center gap-6 text-center"
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  <Mascot emotion="celebrating" size={120} />
                </motion.div>

                <div>
                  <h2
                    className="text-white mb-2"
                    style={{ fontFamily: 'Fredoka One', fontSize: 28 }}
                  >
                    Lesson Complete!
                  </h2>
                  <p className="text-white/70" style={{ fontFamily: 'Nunito', fontSize: 15 }}>
                    Amazing work! You've learned {level.title}!
                  </p>
                </div>

                {!alreadyDone && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', delay: 0.3 }}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl"
                    style={{ background: 'rgba(59,130,246,0.2)', border: '2px solid rgba(96,165,250,0.5)' }}
                  >
                    <span style={{ fontSize: 28 }}>💎</span>
                    <span style={{ fontFamily: 'Fredoka One', fontSize: 22, color: '#60A5FA' }}>+10 Gems!</span>
                  </motion.div>
                )}

                <p className="text-green-400/80 text-sm" style={{ fontFamily: 'Nunito' }}>
                  🎮 The Play button is now unlocked!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom navigation */}
        <div className="px-5 pb-10 pt-4 flex gap-3">
          {!finished ? (
            <>
              <button
                onClick={handleBack}
                className="flex-1 py-4 rounded-2xl border border-white/15 text-white/60 active:scale-95 transition-all"
                style={{ fontFamily: 'Nunito', fontWeight: 700 }}
              >
                ← Back
              </button>
              <motion.button
                onClick={handleNext}
                whileTap={{ scale: 0.97 }}
                className="flex-[2] py-4 rounded-2xl text-white active:scale-95 transition-all flex items-center justify-center gap-2"
                style={{
                  background: `linear-gradient(135deg, ${world.color}, ${world.color}99)`,
                  boxShadow: `0 4px 20px ${world.glowColor}`,
                  fontFamily: 'Fredoka One',
                  fontSize: 18,
                }}
              >
                {currentSlide < slides.length - 1 ? (
                  <>Next <ChevronRight size={20} /></>
                ) : (
                  <>Finish! ✓</>
                )}
              </motion.button>
            </>
          ) : (
            <div className="w-full flex gap-3">
              <button
                onClick={() => navigate(`/world/${worldId}`)}
                className="flex-1 py-4 rounded-2xl border border-white/15 text-white/70 active:scale-95"
                style={{ fontFamily: 'Nunito', fontWeight: 700 }}
              >
                Back to Map
              </button>
              <motion.button
                onClick={() => navigate(`/play/${worldId}/${levelId}`)}
                whileTap={{ scale: 0.97 }}
                className="flex-[2] py-4 rounded-2xl text-white active:scale-95"
                style={{
                  background: `linear-gradient(135deg, ${world.color}, ${world.color}88)`,
                  boxShadow: `0 4px 20px ${world.glowColor}`,
                  fontFamily: 'Fredoka One',
                  fontSize: 18,
                }}
              >
                🎮 Play Now!
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
