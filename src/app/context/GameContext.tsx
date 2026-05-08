import React, { createContext, useContext, useState, useCallback } from 'react';
import { WorldId } from '../data/worlds';

export interface LevelProgress {
  completed: boolean;
  stars: number;
  lessonDone: boolean;
}

export interface PlayerProfile {
  name: string;
  gems: number;
  totalStars: number;
  badges: string[];
  avatarEmoji: string;
  equippedHat: string;
  equippedPet: string;
}

interface GameContextType {
  profile: PlayerProfile;
  progress: Record<string, LevelProgress>;
  getLevelProgress: (worldId: WorldId, levelId: number) => LevelProgress;
  completeLesson: (worldId: WorldId, levelId: number) => void;
  completeLevel: (worldId: WorldId, levelId: number, stars: number, gems: number, badge?: string) => void;
  spendGems: (amount: number) => boolean;
  earnGems: (amount: number) => void;
  setPlayerName: (name: string) => void;
  equipItem: (type: 'hat' | 'pet', item: string) => void;
  equipAvatar: (emoji: string) => void;
}

const defaultProfile: PlayerProfile = {
  name: 'Explorer',
  gems: 50,
  totalStars: 0,
  badges: [],
  avatarEmoji: '🐱',
  equippedHat: '',
  equippedPet: '',
};

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<PlayerProfile>(defaultProfile);
  const [progress, setProgress] = useState<Record<string, LevelProgress>>({});

  const getLevelProgress = useCallback((worldId: WorldId, levelId: number): LevelProgress => {
    const key = `${worldId}-${levelId}`;
    return progress[key] ?? { completed: false, stars: 0, lessonDone: false };
  }, [progress]);

  const completeLesson = useCallback((worldId: WorldId, levelId: number) => {
    const key = `${worldId}-${levelId}`;
    setProgress(prev => ({
      ...prev,
      [key]: { ...prev[key] ?? { completed: false, stars: 0 }, lessonDone: true },
    }));
    setProfile(prev => ({ ...prev, gems: prev.gems + 10 }));
  }, []);

  const completeLevel = useCallback((worldId: WorldId, levelId: number, stars: number, gems: number, badge?: string) => {
    const key = `${worldId}-${levelId}`;
    setProgress(prev => {
      const existing = prev[key] ?? { completed: false, stars: 0, lessonDone: true };
      return {
        ...prev,
        [key]: { completed: true, stars: Math.max(existing.stars, stars), lessonDone: true },
      };
    });
    setProfile(prev => ({
      ...prev,
      gems: prev.gems + gems,
      totalStars: prev.totalStars + stars,
      badges: badge && !prev.badges.includes(badge) ? [...prev.badges, badge] : prev.badges,
    }));
  }, []);

  const spendGems = useCallback((amount: number): boolean => {
    if (profile.gems >= amount) {
      setProfile(prev => ({ ...prev, gems: prev.gems - amount }));
      return true;
    }
    return false;
  }, [profile.gems]);

  const earnGems = useCallback((amount: number) => {
    setProfile(prev => ({ ...prev, gems: prev.gems + amount }));
  }, []);

  const setPlayerName = useCallback((name: string) => {
    setProfile(prev => ({ ...prev, name }));
  }, []);

  const equipItem = useCallback((type: 'hat' | 'pet', item: string) => {
    setProfile(prev => ({
      ...prev,
      equippedHat: type === 'hat' ? item : prev.equippedHat,
      equippedPet: type === 'pet' ? item : prev.equippedPet,
    }));
  }, []);

  const equipAvatar = useCallback((emoji: string) => {
    setProfile(prev => ({ ...prev, avatarEmoji: emoji }));
  }, []);

  return (
    <GameContext.Provider value={{ profile, progress, getLevelProgress, completeLesson, completeLevel, spendGems, earnGems, setPlayerName, equipItem, equipAvatar }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}