import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { SpaceBackground } from '../components/SpaceBackground';
import { NavBar } from '../components/NavBar';
import { WORLDS, WorldId } from '../data/worlds';
import { useGame } from '../context/GameContext';

const FLOAT_DELAYS = [0, 0.5, 1.2, 0.3, 0.9];

// Layout: [Math], [History, Deen], [Manners, Art]
const PLANET_SIZES = [160, 140, 140, 130, 130];

export function GalaxyHub() {
  const navigate = useNavigate();
  const { getLevelProgress } = useGame();

  const getWorldProgress = (worldId: WorldId) => {
    const world = WORLDS.find(w => w.id === worldId);
    if (!world) return { done: 0, total: 0 };
    const done = world.levels.filter((_, i) => getLevelProgress(worldId, i + 1).completed).length;
    return { done, total: world.levels.length };
  };

  const mathWorld = WORLDS[0];
  const row2 = [WORLDS[1], WORLDS[2]];
  const row3 = [WORLDS[3], WORLDS[4]];

  const PlanetButton = ({ world, idx }: { world: typeof WORLDS[0]; idx: number }) => {
    const size = PLANET_SIZES[idx];
    const { done, total } = getWorldProgress(world.id as WorldId);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: idx * 0.12, duration: 0.5, type: 'spring', stiffness: 200 }}
      >
        <motion.button
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2.8 + idx * 0.3, repeat: Infinity, ease: 'easeInOut', delay: FLOAT_DELAYS[idx] }}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => navigate(`/world/${world.id}`)}
          className="relative flex flex-col items-center"
          style={{ width: size }}
        >
          {/* Glow */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${world.glowColor} 0%, transparent 70%)`,
              filter: 'blur(18px)',
              transform: 'scale(1.4)',
              pointerEvents: 'none',
            }}
          />

          {/* Planet */}
          <div
            className="relative rounded-full flex flex-col items-center justify-center"
            style={{
              width: size,
              height: size,
              background: `radial-gradient(ellipse at 32% 32%, ${world.color}DD 0%, ${world.color}55 50%, ${world.color}22 100%)`,
              border: `2px solid ${world.color}80`,
              boxShadow: `0 0 30px ${world.glowColor}, 0 8px 32px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.25)`,
            }}
          >
            {/* Craters / surface */}
            <div className="absolute inset-0 rounded-full overflow-hidden opacity-30">
              <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] rounded-full" style={{ background: 'rgba(0,0,0,0.3)' }} />
              <div className="absolute top-[55%] left-[15%] w-[12%] h-[12%] rounded-full" style={{ background: 'rgba(0,0,0,0.25)' }} />
            </div>

            {/* Planet ring (alternate planets) */}
            {idx % 2 === 1 && (
              <div
                className="absolute pointer-events-none"
                style={{
                  width: size * 1.45,
                  height: size * 0.22,
                  border: `2.5px solid ${world.color}50`,
                  borderRadius: '50%',
                  transform: 'rotateX(68deg)',
                  left: -(size * 0.225),
                }}
              />
            )}

            {/* World emoji */}
            <span style={{ fontSize: size * 0.27, lineHeight: 1, zIndex: 1 }}>{world.emoji}</span>

            {/* Name */}
            <p
              className="text-center mt-1 px-2 z-10 relative"
              style={{
                fontFamily: 'Fredoka One, sans-serif',
                fontSize: Math.max(11, size * 0.115),
                color: 'white',
                textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                lineHeight: 1.2,
              }}
            >
              {world.name}
            </p>

            {/* Progress badge */}
            {done > 0 && (
              <div
                className="mt-0.5 px-2 py-0.5 rounded-full z-10"
                style={{ background: 'rgba(0,0,0,0.45)', fontSize: 10, color: world.textColor, fontFamily: 'Nunito, sans-serif', fontWeight: 800 }}
              >
                {done}/{total} ⭐
              </div>
            )}

            {/* Shine overlay */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.28) 0%, transparent 55%)' }}
            />
          </div>
        </motion.button>
      </motion.div>
    );
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <SpaceBackground />

      <div className="relative z-10 flex flex-col h-screen max-w-[430px] mx-auto">
        <NavBar />

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center py-1"
        >
          <h1
            style={{
              fontFamily: 'Fredoka One, sans-serif',
              fontSize: 20,
              background: 'linear-gradient(90deg, #C084FC, #818CF8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            ✨ Sadeen Galaxy ✨
          </h1>
          <p className="text-white/40 text-xs mt-0.5" style={{ fontFamily: 'Nunito' }}>
            Choose your world!
          </p>
        </motion.div>

        {/* Galaxy map */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4 pb-4 px-4">
          {/* Row 1: Math (center, big) */}
          <div className="flex justify-center">
            <PlanetButton world={mathWorld} idx={0} />
          </div>

          {/* Connector */}
          <div className="flex w-full justify-center gap-16 opacity-25">
            <div className="w-px h-6 bg-white" style={{ transform: 'rotate(20deg)' }} />
            <div className="w-px h-6 bg-white" style={{ transform: 'rotate(-20deg)' }} />
          </div>

          {/* Row 2: History + Deen */}
          <div className="flex w-full justify-around items-center">
            <PlanetButton world={row2[0]} idx={1} />
            <PlanetButton world={row2[1]} idx={2} />
          </div>

          {/* Connector */}
          <div className="flex w-full justify-around opacity-20">
            <div className="w-px h-5 bg-white" style={{ marginLeft: '20%' }} />
            <div className="w-px h-5 bg-white" style={{ marginRight: '20%' }} />
          </div>

          {/* Row 3: Manners + Art */}
          <div className="flex w-full justify-around items-center">
            <PlanetButton world={row3[0]} idx={3} />
            <PlanetButton world={row3[1]} idx={4} />
          </div>
        </div>

        {/* Bottom hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center pb-5"
        >
          <p className="text-white/30 text-xs" style={{ fontFamily: 'Nunito' }}>
            Tap a world to start your adventure! 🚀
          </p>
        </motion.div>
      </div>
    </div>
  );
}
