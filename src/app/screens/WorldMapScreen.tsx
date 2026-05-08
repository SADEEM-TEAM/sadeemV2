import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { SpaceBackground } from '../components/SpaceBackground';
import { NavBar } from '../components/NavBar';
import { Mascot } from '../components/Mascot';
import { WORLDS, getWorld } from '../data/worlds';
import { useGame } from '../context/GameContext';
import { WorldId } from '../data/worlds';
import { Lock, Star } from 'lucide-react';

function StarRow({ count, max = 3 }: { count: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star key={i} size={12} fill={i < count ? '#FBBF24' : 'transparent'} stroke={i < count ? '#FBBF24' : 'rgba(255,255,255,0.3)'} />
      ))}
    </div>
  );
}

export function WorldMapScreen() {
  const { worldId } = useParams<{ worldId: string }>();
  const navigate = useNavigate();
  const { getLevelProgress } = useGame();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const world = getWorld(worldId as WorldId);
  if (!world) return <div className="text-white p-8">World not found</div>;

  const isLevelUnlocked = (levelId: number) => {
    if (levelId === 1) return true;
    return getLevelProgress(world.id, levelId - 1).completed;
  };

  const selectedLevelData = selectedLevel ? world.levels.find(l => l.id === selectedLevel) : null;
  const selectedLevelProgress = selectedLevel ? getLevelProgress(world.id, selectedLevel) : null;

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
    >
      <SpaceBackground />

      {/* World colored overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 20%, ${world.glowColor} 0%, transparent 60%)`,
          opacity: 0.4,
          zIndex: 1,
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen max-w-[430px] mx-auto">
        <NavBar showBack backTo="/galaxy" title={world.name} worldColor={world.color} />

        {/* World header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-5 pb-2 flex items-center gap-3"
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
            style={{ background: `${world.color}33`, border: `2px solid ${world.color}60` }}
          >
            {world.emoji}
          </div>
          <div>
            <p className="text-white/50 text-xs" style={{ fontFamily: 'Nunito, sans-serif' }}>{world.nameAr}</p>
            <p className="text-white/70 text-sm" style={{ fontFamily: 'Nunito, sans-serif' }}>{world.description}</p>
          </div>
        </motion.div>

        {/* Level path */}
        <div className="flex-1 px-5 py-4 overflow-y-auto">
          <div className="relative flex flex-col items-center gap-2">
            {world.levels.map((level, idx) => {
              const unlocked = isLevelUnlocked(level.id);
              const progress = getLevelProgress(world.id, level.id);
              const isCompleted = progress.completed;

              // Alternate left/right positioning for path effect
              const isLeft = idx % 2 === 0;

              return (
                <motion.div
                  key={level.id}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`flex items-center gap-4 w-full ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  {/* Connector line */}
                  {idx > 0 && (
                    <div
                      className="absolute"
                      style={{
                        top: `${idx * 100 - 50}px`,
                        left: isLeft ? '50%' : '20%',
                        width: '2px',
                        height: '60px',
                        background: unlocked
                          ? `linear-gradient(180deg, ${world.color}80, ${world.color}20)`
                          : 'rgba(255,255,255,0.1)',
                      }}
                    />
                  )}

                  {/* Level node button */}
                  <button
                    onClick={() => unlocked && setSelectedLevel(level.id)}
                    disabled={!unlocked}
                    className={`relative flex flex-col items-center justify-center rounded-2xl p-4 border-2 shadow-xl transition-all active:scale-95 ${
                      isLeft ? 'ml-4' : 'mr-4'
                    }`}
                    style={{
                      width: 160,
                      background: unlocked
                        ? isCompleted
                          ? `linear-gradient(135deg, ${world.color}40, ${world.color}20)`
                          : 'rgba(255,255,255,0.08)'
                        : 'rgba(255,255,255,0.03)',
                      borderColor: unlocked
                        ? isCompleted ? world.color : `${world.color}60`
                        : 'rgba(255,255,255,0.1)',
                      boxShadow: unlocked && !isCompleted ? `0 0 20px ${world.glowColor}` : 'none',
                      opacity: unlocked ? 1 : 0.5,
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    {/* Level number badge */}
                    <div
                      className="absolute -top-3 -left-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        background: unlocked ? world.color : '#444',
                        color: 'white',
                        fontFamily: 'Nunito, sans-serif',
                        fontWeight: 900,
                        boxShadow: unlocked ? `0 0 10px ${world.glowColor}` : 'none',
                      }}
                    >
                      {level.id}
                    </div>

                    {/* Completed checkmark */}
                    {isCompleted && (
                      <div className="absolute -top-2 -right-2 text-sm">✅</div>
                    )}

                    {/* Lock icon */}
                    {!unlocked && (
                      <div className="absolute top-2 right-2">
                        <Lock size={14} className="text-white/30" />
                      </div>
                    )}

                    <span style={{ fontSize: 32 }}>{level.emoji}</span>
                    <p
                      className="text-center mt-1"
                      style={{
                        fontFamily: 'Nunito, sans-serif',
                        fontWeight: 700,
                        fontSize: 13,
                        color: unlocked ? 'white' : 'rgba(255,255,255,0.3)',
                      }}
                    >
                      {level.title}
                    </p>
                    {isCompleted && <StarRow count={progress.stars} />}
                    {!isCompleted && unlocked && (
                      <p style={{ fontSize: 11, color: world.textColor, fontFamily: 'Nunito' }}>Tap to play!</p>
                    )}
                  </button>

                  {/* Side decoration */}
                  <div className="flex-1 flex items-center justify-center opacity-30">
                    {unlocked && !isCompleted && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ fontSize: 20 }}
                      >
                        ✦
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* End of path - coming soon */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 flex flex-col items-center gap-2 opacity-50"
            >
              <div className="w-px h-12 bg-white/20" />
              <div className="px-6 py-3 rounded-2xl border border-white/10 bg-white/5">
                <p className="text-white/50 text-sm text-center" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  🔮 More coming soon...
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Level Selection Modal */}
      <AnimatePresence>
        {selectedLevel && selectedLevelData && selectedLevelProgress && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedLevel(null)}
          >
            <motion.div
              initial={{ y: 300, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 300, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-[430px] rounded-t-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, #1a0550 0%, #0e0330 100%)',
                border: `2px solid ${world.color}60`,
                borderBottom: 'none',
              }}
            >
              {/* Modal header */}
              <div
                className="px-6 pt-6 pb-4"
                style={{ borderBottom: `1px solid ${world.color}30` }}
              >
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: 40 }}>{selectedLevelData.emoji}</span>
                  <div>
                    <h2
                      className="text-white"
                      style={{ fontFamily: 'Fredoka One, sans-serif', fontSize: 22 }}
                    >
                      {selectedLevelData.title}
                    </h2>
                    <p style={{ color: world.textColor, fontFamily: 'Nunito', fontSize: 13 }}>
                      World {selectedLevel} • Earn up to {selectedLevelData.gemReward} 💎
                    </p>
                  </div>
                </div>
                {selectedLevelProgress.completed && (
                  <div className="mt-2 flex items-center gap-2">
                    <StarRow count={selectedLevelProgress.stars} />
                    <span style={{ color: world.textColor, fontFamily: 'Nunito', fontSize: 12 }}>
                      Best score!
                    </span>
                  </div>
                )}
              </div>

              {/* Mascot + speech */}
              <div className="px-6 py-4">
                <div className="flex items-end gap-3">
                  <Mascot emotion="happy" size={70} />
                  <div
                    className="flex-1 rounded-2xl rounded-bl-none px-4 py-3"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <p className="text-white/80 text-sm" style={{ fontFamily: 'Nunito', lineHeight: 1.5 }}>
                      {selectedLevelProgress.lessonDone
                        ? "Great! You know this lesson. Ready to play? 🎮"
                        : "Hi! Let's start with the lesson first, then we'll play! 📖"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="px-6 pb-8 flex gap-3">
                {/* Learn button */}
                <button
                  onClick={() => {
                    setSelectedLevel(null);
                    navigate(`/lesson/${world.id}/${selectedLevel}`);
                  }}
                  className="flex-1 py-4 rounded-2xl flex flex-col items-center gap-1 transition-all active:scale-95"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '2px solid rgba(255,255,255,0.15)',
                  }}
                >
                  <span style={{ fontSize: 28 }}>📖</span>
                  <span style={{ fontFamily: 'Fredoka One', fontSize: 16, color: 'white' }}>LEARN</span>
                  {selectedLevelProgress.lessonDone && (
                    <span style={{ fontSize: 10, color: '#86efac', fontFamily: 'Nunito' }}>✓ Done</span>
                  )}
                </button>

                {/* Play button */}
                <button
                  onClick={() => {
                    if (!selectedLevelProgress.lessonDone) return;
                    setSelectedLevel(null);
                    navigate(`/play/${world.id}/${selectedLevel}`);
                  }}
                  className="flex-1 py-4 rounded-2xl flex flex-col items-center gap-1 transition-all active:scale-95 relative overflow-hidden"
                  style={{
                    background: selectedLevelProgress.lessonDone
                      ? `linear-gradient(135deg, ${world.color}80, ${world.color}40)`
                      : 'rgba(255,255,255,0.04)',
                    border: `2px solid ${selectedLevelProgress.lessonDone ? world.color : 'rgba(255,255,255,0.08)'}`,
                    opacity: selectedLevelProgress.lessonDone ? 1 : 0.5,
                    boxShadow: selectedLevelProgress.lessonDone ? `0 0 20px ${world.glowColor}` : 'none',
                  }}
                >
                  <span style={{ fontSize: 28 }}>🎮</span>
                  <span style={{ fontFamily: 'Fredoka One', fontSize: 16, color: selectedLevelProgress.lessonDone ? 'white' : 'rgba(255,255,255,0.3)' }}>PLAY</span>
                  {!selectedLevelProgress.lessonDone && (
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'Nunito' }}>🔒 Do lesson first</span>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}