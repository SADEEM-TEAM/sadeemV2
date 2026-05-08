import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { SpaceBackground } from '../components/SpaceBackground';
import { NavBar } from '../components/NavBar';
import { Mascot } from '../components/Mascot';
import { useGame } from '../context/GameContext';
import { WORLDS } from '../data/worlds';

const STORE_ITEMS = {
  hats: [
    { id: 'crown', emoji: '👑', label: 'Golden Crown', price: 50 },
    { id: 'helmet', emoji: '⛑️', label: 'Space Helmet', price: 40 },
    { id: 'wizard', emoji: '🧙', label: 'Wizard Hat', price: 60 },
    { id: 'chef', emoji: '👨‍🍳', label: 'Chef Hat', price: 35 },
  ],
  pets: [
    { id: 'star', emoji: '⭐', label: 'Star Friend', price: 80 },
    { id: 'rocket', emoji: '🚀', label: 'Mini Rocket', price: 100 },
    { id: 'bird', emoji: '🦜', label: 'Parrot', price: 70 },
    { id: 'robot', emoji: '🤖', label: 'Robot Pal', price: 90 },
  ],
  avatars: [
    { id: '🐱', emoji: '🐱', label: 'Space Cat', price: 0 },
    { id: '🦊', emoji: '🦊', label: 'Fox', price: 60 },
    { id: '🐼', emoji: '🐼', label: 'Panda', price: 80 },
    { id: '🐸', emoji: '🐸', label: 'Frog', price: 50 },
    { id: '🦁', emoji: '🦁', label: 'Lion', price: 100 },
    { id: '🐺', emoji: '🐺', label: 'Wolf', price: 90 },
  ],
};

type StoreTab = 'avatars' | 'hats' | 'pets';

export function ProfileScreen() {
  const navigate = useNavigate();
  const { profile, getLevelProgress, spendGems, equipItem, equipAvatar } = useGame();
  const [activeTab, setActiveTab] = useState<StoreTab>('avatars');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleBuy = (type: 'hat' | 'pet', item: { id: string; emoji: string; label: string; price: number }) => {
    if (item.price === 0) {
      equipItem(type, item.emoji);
      showToast(`Equipped ${item.label}!`);
      return;
    }
    const success = spendGems(item.price);
    if (success) {
      equipItem(type, item.emoji);
      showToast(`${item.label} equipped! 🎉`);
    } else {
      showToast(`Not enough 💎 gems!`);
    }
  };

  const handleEquipAvatar = (emoji: string, price: number) => {
    if (emoji === profile.avatarEmoji) return;
    if (price > 0) {
      const success = spendGems(price);
      if (!success) { showToast('Not enough 💎 gems!'); return; }
    }
    equipAvatar(emoji);
    showToast(`New avatar equipped! 🎉`);
  };

  // Total progress
  const totalLevels = WORLDS.reduce((sum, w) => sum + w.levels.length, 0);
  const completedLevels = WORLDS.reduce((sum, w) => sum + w.levels.filter((_, i) => getLevelProgress(w.id, i + 1).completed).length, 0);

  const tabs: { key: StoreTab; label: string; emoji: string }[] = [
    { key: 'avatars', label: 'Avatar', emoji: '🐱' },
    { key: 'hats', label: 'Hats', emoji: '👑' },
    { key: 'pets', label: 'Pets', emoji: '⭐' },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <SpaceBackground />

      <div className="relative z-10 flex flex-col min-h-screen max-w-[430px] mx-auto">
        <NavBar showBack backTo="/galaxy" title="My Profile" />

        <div className="flex-1 overflow-y-auto px-4 pb-8 flex flex-col gap-5">
          {/* Profile card */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-5"
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(59,130,246,0.2))',
              border: '1px solid rgba(167,139,250,0.3)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div
                className="relative flex items-center justify-center rounded-full"
                style={{
                  width: 80, height: 80,
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.5), rgba(59,130,246,0.5))',
                  border: '3px solid rgba(167,139,250,0.6)',
                  boxShadow: '0 0 20px rgba(124,58,237,0.4)',
                  fontSize: 36,
                }}
              >
                {profile.avatarEmoji}
                {profile.equippedHat && (
                  <span className="absolute -top-2 right-0" style={{ fontSize: 20 }}>{profile.equippedHat}</span>
                )}
                {profile.equippedPet && (
                  <span className="absolute -bottom-1 -right-2" style={{ fontSize: 18 }}>{profile.equippedPet}</span>
                )}
              </div>

              <div className="flex-1">
                <h2 className="text-white" style={{ fontFamily: 'Fredoka One', fontSize: 22 }}>
                  {profile.name}
                </h2>

                <div className="flex gap-3 mt-1">
                  <span className="flex items-center gap-1">
                    <span style={{ fontSize: 14 }}>⭐</span>
                    <span style={{ fontFamily: 'Nunito', fontWeight: 800, color: '#FBBF24', fontSize: 13 }}>
                      {profile.totalStars} Stars
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span style={{ fontSize: 14 }}>💎</span>
                    <span style={{ fontFamily: 'Nunito', fontWeight: 800, color: '#60A5FA', fontSize: 13 }}>
                      {profile.gems} Gems
                    </span>
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-2">
                  <div className="flex justify-between mb-1">
                    <span style={{ fontFamily: 'Nunito', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                      Progress
                    </span>
                    <span style={{ fontFamily: 'Nunito', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                      {completedLevels}/{totalLevels}
                    </span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(completedLevels / totalLevels) * 100}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, #A78BFA, #60A5FA)' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Badges */}
          {profile.badges.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 style={{ fontFamily: 'Fredoka One', fontSize: 18, color: 'white', marginBottom: 10 }}>
                🏅 My Badges
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.badges.map(badge => (
                  <motion.div
                    key={badge}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                    className="px-3 py-2 rounded-2xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(245,158,11,0.1))',
                      border: '1px solid rgba(251,191,36,0.3)',
                    }}
                  >
                    <span style={{ fontFamily: 'Nunito', fontWeight: 700, color: '#FBBF24', fontSize: 13 }}>
                      {badge}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* World progress */}
          <div>
            <h3 style={{ fontFamily: 'Fredoka One', fontSize: 18, color: 'white', marginBottom: 10 }}>
              🌍 World Progress
            </h3>
            <div className="flex flex-col gap-2">
              {WORLDS.map(world => {
                const done = world.levels.filter((_, i) => getLevelProgress(world.id, i + 1).completed).length;
                return (
                  <button
                    key={world.id}
                    onClick={() => navigate(`/world/${world.id}`)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl active:scale-97 transition-all"
                    style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${world.color}30` }}
                  >
                    <span style={{ fontSize: 24 }}>{world.emoji}</span>
                    <div className="flex-1">
                      <p style={{ fontFamily: 'Nunito', fontWeight: 700, color: 'white', fontSize: 14, textAlign: 'left' }}>
                        {world.name}
                      </p>
                      <div className="flex gap-0.5 mt-1">
                        {world.levels.map((_, i) => (
                          <div
                            key={i}
                            className="h-1.5 flex-1 rounded-full"
                            style={{ background: getLevelProgress(world.id, i + 1).completed ? world.color : 'rgba(255,255,255,0.1)' }}
                          />
                        ))}
                      </div>
                    </div>
                    <span style={{ fontFamily: 'Nunito', fontWeight: 800, color: world.textColor, fontSize: 13 }}>
                      {done}/{world.levels.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Store */}
          <div>
            <h3 style={{ fontFamily: 'Fredoka One', fontSize: 18, color: 'white', marginBottom: 10 }}>
              🛍️ The Souk (Store)
            </h3>

            {/* Tabs */}
            <div className="flex gap-2 mb-4 p-1 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: activeTab === tab.key ? 'rgba(255,255,255,0.12)' : 'transparent',
                    border: activeTab === tab.key ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
                  }}
                >
                  <span style={{ fontSize: 16 }}>{tab.emoji}</span>
                  <span style={{ fontFamily: 'Nunito', fontWeight: 700, color: activeTab === tab.key ? 'white' : 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Store items */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-2 gap-3"
              >
                {activeTab === 'avatars' && STORE_ITEMS.avatars.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleEquipAvatar(item.id, item.price)}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl active:scale-95 transition-all"
                    style={{
                      background: profile.avatarEmoji === item.id ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.05)',
                      border: `2px solid ${profile.avatarEmoji === item.id ? 'rgba(167,139,250,0.6)' : 'rgba(255,255,255,0.08)'}`,
                    }}
                  >
                    <span style={{ fontSize: 40 }}>{item.emoji}</span>
                    <p style={{ fontFamily: 'Nunito', fontWeight: 700, color: 'white', fontSize: 13 }}>{item.label}</p>
                    {item.price === 0 ? (
                      <span style={{ fontFamily: 'Nunito', color: '#4ade80', fontSize: 12 }}>
                        {profile.avatarEmoji === item.id ? '✓ Equipped' : 'Free!'}
                      </span>
                    ) : (
                      <span style={{ fontFamily: 'Nunito', fontWeight: 800, color: '#60A5FA', fontSize: 13 }}>
                        💎 {item.price}
                      </span>
                    )}
                  </button>
                ))}

                {activeTab === 'hats' && STORE_ITEMS.hats.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleBuy('hat', item)}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl active:scale-95 transition-all"
                    style={{
                      background: profile.equippedHat === item.emoji ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.05)',
                      border: `2px solid ${profile.equippedHat === item.emoji ? 'rgba(167,139,250,0.6)' : 'rgba(255,255,255,0.08)'}`,
                    }}
                  >
                    <span style={{ fontSize: 40 }}>{item.emoji}</span>
                    <p style={{ fontFamily: 'Nunito', fontWeight: 700, color: 'white', fontSize: 13 }}>{item.label}</p>
                    <span style={{ fontFamily: 'Nunito', fontWeight: 800, color: '#60A5FA', fontSize: 13 }}>
                      {profile.equippedHat === item.emoji ? '✓ Equipped' : `💎 ${item.price}`}
                    </span>
                  </button>
                ))}

                {activeTab === 'pets' && STORE_ITEMS.pets.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleBuy('pet', item)}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl active:scale-95 transition-all"
                    style={{
                      background: profile.equippedPet === item.emoji ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.05)',
                      border: `2px solid ${profile.equippedPet === item.emoji ? 'rgba(167,139,250,0.6)' : 'rgba(255,255,255,0.08)'}`,
                    }}
                  >
                    <span style={{ fontSize: 40 }}>{item.emoji}</span>
                    <p style={{ fontFamily: 'Nunito', fontWeight: 700, color: 'white', fontSize: 13 }}>{item.label}</p>
                    <span style={{ fontFamily: 'Nunito', fontWeight: 800, color: '#60A5FA', fontSize: 13 }}>
                      {profile.equippedPet === item.emoji ? '✓ Equipped' : `💎 ${item.price}`}
                    </span>
                  </button>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl z-50"
            style={{ background: 'rgba(30,20,60,0.95)', border: '1px solid rgba(167,139,250,0.4)', backdropFilter: 'blur(10px)' }}
          >
            <p style={{ fontFamily: 'Nunito', fontWeight: 700, color: 'white', fontSize: 14 }}>{toast}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}