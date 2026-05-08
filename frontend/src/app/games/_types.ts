import type { GameType } from '@/lib/types';

export interface GamePluginProps {
  game: {
    _id: string;
    gameType: GameType;
    instructionAr: string;
    payload: any;
    xpReward: number;
    heartPenalty: number;
  };
  accent: string;
  onAnswer: (answer: any) => Promise<{
    correct: boolean;
    xpEarned: number;
    heartsLost: number;
    errors: number;
  }>;
  onComplete: () => void;
}

export interface GamePlugin {
  type: GameType;
  Component: React.ComponentType<GamePluginProps>;
}
