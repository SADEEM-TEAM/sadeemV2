import React from 'react';
import { useNavigate } from 'react-router';
import { useGame } from '../context/GameContext';
import { ChevronLeft, Settings } from 'lucide-react';

interface NavBarProps {
  showBack?: boolean;
  backTo?: string;
  title?: string;
  worldColor?: string;
}

export function NavBar({ showBack = false, backTo, title, worldColor }: NavBarProps) {
  const { profile } = useGame();
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) navigate(backTo);
    else navigate(-1);
  };

  return (
    <div className="relative z-20 flex items-center justify-between px-4 py-3">
      {/* Left: Back or Avatar */}
      <div className="flex items-center gap-2">
        {showBack ? (
          <button
            onClick={handleBack}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-3 py-2 transition-all active:scale-95"
          >
            <ChevronLeft size={18} className="text-white" />
            <span className="text-white text-sm" style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700 }}>Back</span>
          </button>
        ) : (
          <button
            onClick={() => navigate('/profile')}
            className="relative flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-purple-500/60 to-blue-500/60 border-2 border-white/30 shadow-lg hover:scale-105 transition-transform active:scale-95"
          >
            <span style={{ fontSize: 22 }}>{profile.avatarEmoji}{profile.equippedHat}</span>
          </button>
        )}
      </div>

      {/* Center: Title or Currencies */}
      {title ? (
        <h1
          className="text-white"
          style={{ fontFamily: 'Fredoka One, Nunito, sans-serif', fontSize: 20, textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
        >
          {title}
        </h1>
      ) : (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5">
            <span style={{ fontSize: 16 }}>⭐</span>
            <span className="text-yellow-300 text-sm" style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800 }}>
              {profile.totalStars}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5">
            <span style={{ fontSize: 16 }}>💎</span>
            <span className="text-blue-300 text-sm" style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800 }}>
              {profile.gems}
            </span>
          </div>
        </div>
      )}

      {/* Right: Settings */}
      <button
        onClick={() => navigate('/profile')}
        className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all active:scale-95"
      >
        <Settings size={18} className="text-white/80" />
      </button>
    </div>
  );
}
