import React from 'react';

import mascotBlue from '@/assets/mascot_blue.svg';
import mascotBlueExcited from '@/assets/mascot_blue_excited.svg';
import mascotBlueThinking from '@/assets/mascot_blue_thinking.svg';
import mascotBlueCelebrating from '@/assets/mascot_blue_celebrating.svg';
import mascotPink from '@/assets/mascot_pink.svg';
import mascotPinkExcited from '@/assets/mascot_pink_excited.svg';
import mascotPinkThinking from '@/assets/mascot_pink_thinking.svg';
import mascotPinkCelebrating from '@/assets/mascot_pink_celebrating.svg';

export type MascotEmotion = 'happy' | 'excited' | 'thinking' | 'sad' | 'celebrating' | 'neutral';
export type MascotVariant = 'blue' | 'pink';

const SVG_MAP: Record<MascotVariant, Record<MascotEmotion, string>> = {
  blue: {
    happy: mascotBlue,
    neutral: mascotBlue,
    excited: mascotBlueExcited,
    celebrating: mascotBlueCelebrating,
    thinking: mascotBlueThinking,
    sad: mascotBlueThinking
  },
  pink: {
    happy: mascotPink,
    neutral: mascotPink,
    excited: mascotPinkExcited,
    celebrating: mascotPinkCelebrating,
    thinking: mascotPinkThinking,
    sad: mascotPinkThinking
  }
};

interface MascotProps {
  emotion?: MascotEmotion;
  size?: number;
  className?: string;
  flip?: boolean;
  /** When supplied, render the custom SVG art for that variant instead of the inline drawing. */
  variant?: MascotVariant;
}

export function Mascot({ emotion = 'happy', size = 100, className = '', flip = false, variant }: MascotProps) {
  // Custom SVG path: render the artwork as <img>, picked by emotion+variant.
  if (variant) {
    const src = SVG_MAP[variant][emotion] ?? SVG_MAP[variant].happy;
    return (
      <img
        src={src}
        alt=""
        aria-hidden
        className={`inline-block ${className}`}
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          transform: flip ? 'scaleX(-1)' : undefined,
          filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.45))',
          userSelect: 'none',
          pointerEvents: 'none'
        }}
        draggable={false}
      />
    );
  }

  const getEyes = () => {
    switch (emotion) {
      case 'excited':
      case 'celebrating':
        return (
          <>
            {/* Excited: star eyes */}
            <text x="34" y="54" fontSize="14" textAnchor="middle" fill="#FFD700">★</text>
            <text x="66" y="54" fontSize="14" textAnchor="middle" fill="#FFD700">★</text>
          </>
        );
      case 'sad':
        return (
          <>
            <circle cx="35" cy="50" r="7" fill="white" />
            <circle cx="65" cy="50" r="7" fill="white" />
            <ellipse cx="35" cy="52" rx="5" ry="4" fill="#1a1a3e" />
            <ellipse cx="65" cy="52" rx="5" ry="4" fill="#1a1a3e" />
            <circle cx="37" cy="50" r="1.5" fill="white" />
            <circle cx="67" cy="50" r="1.5" fill="white" />
            {/* Sad tears */}
            <ellipse cx="30" cy="60" rx="2" ry="3" fill="#60A5FA" opacity="0.8" />
            <ellipse cx="70" cy="60" rx="2" ry="3" fill="#60A5FA" opacity="0.8" />
          </>
        );
      case 'thinking':
        return (
          <>
            <circle cx="35" cy="50" r="7" fill="white" />
            <circle cx="65" cy="50" r="7" fill="white" />
            <circle cx="36" cy="49" r="4" fill="#1a1a3e" />
            <circle cx="64" cy="51" r="4" fill="#1a1a3e" />
            <circle cx="37" cy="47" r="1.5" fill="white" />
            <circle cx="65" cy="49" r="1.5" fill="white" />
          </>
        );
      default: // happy, neutral
        return (
          <>
            <circle cx="35" cy="50" r="7" fill="white" />
            <circle cx="65" cy="50" r="7" fill="white" />
            <circle cx="36" cy="51" r="4.5" fill="#1a1a3e" />
            <circle cx="66" cy="51" r="4.5" fill="#1a1a3e" />
            <circle cx="38" cy="49" r="1.8" fill="white" />
            <circle cx="68" cy="49" r="1.8" fill="white" />
          </>
        );
    }
  };

  const getMouth = () => {
    switch (emotion) {
      case 'excited':
      case 'celebrating':
        return <path d="M 38 65 Q 50 78 62 65" stroke="#FF6B9D" strokeWidth="2.5" fill="#FF6B9D" fillOpacity="0.3" strokeLinecap="round" />;
      case 'sad':
        return <path d="M 40 70 Q 50 63 60 70" stroke="#888" strokeWidth="2" fill="none" strokeLinecap="round" />;
      case 'thinking':
        return <path d="M 44 67 Q 50 70 56 67" stroke="#666" strokeWidth="2" fill="none" strokeLinecap="round" />;
      default:
        return <path d="M 38 65 Q 50 75 62 65" stroke="#FF6B9D" strokeWidth="2" fill="none" strokeLinecap="round" />;
    }
  };

  return (
    <div
      className={`inline-block ${className}`}
      style={{ width: size, height: size, transform: flip ? 'scaleX(-1)' : undefined }}
    >
      <svg viewBox="0 0 100 110" width={size} height={size}>
        {/* Body */}
        <ellipse cx="50" cy="90" rx="22" ry="18" fill="#4B7BEC" />
        <ellipse cx="50" cy="82" rx="18" ry="14" fill="#5B8DEF" />

        {/* Space suit collar */}
        <ellipse cx="50" cy="78" rx="22" ry="7" fill="none" stroke="rgba(147,197,253,0.6)" strokeWidth="2.5" />

        {/* Helmet glow ring */}
        <circle cx="50" cy="48" r="35" fill="none" stroke="rgba(147,197,253,0.25)" strokeWidth="3" />

        {/* Head */}
        <circle cx="50" cy="48" r="28" fill="#5B8DEF" />

        {/* Ear left */}
        <polygon points="26,28 19,10 37,24" fill="#5B8DEF" />
        <polygon points="28,26 23,15 34,23" fill="#FFB3CC" />

        {/* Ear right */}
        <polygon points="74,28 81,10 63,24" fill="#5B8DEF" />
        <polygon points="72,26 77,15 66,23" fill="#FFB3CC" />

        {/* Cheek blushes */}
        <ellipse cx="22" cy="62" rx="7" ry="4" fill="#FF9EBB" opacity="0.4" />
        <ellipse cx="78" cy="62" rx="7" ry="4" fill="#FF9EBB" opacity="0.4" />

        {/* Eyes */}
        {getEyes()}

        {/* Nose */}
        <ellipse cx="50" cy="59" rx="3" ry="2.5" fill="#FF6B9D" />

        {/* Mouth */}
        {getMouth()}

        {/* Antenna */}
        <line x1="50" y1="20" x2="50" y2="10" stroke="rgba(147,197,253,0.8)" strokeWidth="1.5" />
        <circle cx="50" cy="8" r="3" fill="#60A5FA" />
        <circle cx="50" cy="8" r="2" fill="white" opacity="0.6" />

        {/* Stars on body */}
        {emotion === 'celebrating' && (
          <>
            <text x="35" y="93" fontSize="8" fill="#FFD700">★</text>
            <text x="58" y="90" fontSize="6" fill="#FFD700">✦</text>
            <text x="28" y="83" fontSize="6" fill="#A78BFA">★</text>
          </>
        )}
      </svg>
    </div>
  );
}

interface MascotBubbleProps {
  text: string;
  emotion?: MascotEmotion;
  size?: number;
  className?: string;
}

export function MascotBubble({ text, emotion = 'happy', size = 80, className = '' }: MascotBubbleProps) {
  return (
    <div className={`flex items-end gap-3 ${className}`}>
      <Mascot emotion={emotion} size={size} />
      <div className="relative bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl rounded-bl-none px-4 py-3 max-w-xs shadow-lg mb-4">
        <p className="text-white text-sm leading-relaxed" style={{ fontFamily: 'Nunito, sans-serif' }}>
          {text}
        </p>
        {/* Tail */}
        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white/15 rounded-br-full" />
      </div>
    </div>
  );
}
