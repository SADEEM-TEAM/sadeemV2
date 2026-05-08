import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: (next?: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (v: boolean) => void;
}

export const useUI = create<UIState>((set, get) => ({
  sidebarOpen: false,
  toggleSidebar: (next) => set({ sidebarOpen: next ?? !get().sidebarOpen }),
  reducedMotion: typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false,
  setReducedMotion: (v) => set({ reducedMotion: v })
}));
