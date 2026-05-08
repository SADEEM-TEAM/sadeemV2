import { create } from 'zustand';
import { api } from '../lib/api';
import { enableMockMode, resetMockState } from '../lib/mock-adapter';
import { MOCK_USER } from '../lib/mock-data';
import type { AuthUser, MascotPref, Role } from '../lib/types';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (input: {
    username: string;
    email: string;
    password: string;
    role: Role;
  }) => Promise<AuthUser>;
  saveOnboarding: (input: {
    age?: number;
    gradeLabel?: string;
    establishment?: string;
    mascotPref?: MascotPref;
    dailyGoalXp?: number;
  }) => Promise<AuthUser>;
  refresh: () => Promise<void>;
  logout: () => void;
  enterDemoMode: (role?: Role) => Promise<AuthUser>;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('sadeen.token'),
  loading: false,

  async hydrate() {
    const token = localStorage.getItem('sadeen.token');
    if (!token) return;
    try {
      const { data } = await api.get('/users/me');
      set({ user: data.data, token });
    } catch {
      localStorage.removeItem('sadeen.token');
      set({ user: null, token: null });
    }
  },

  async login(email, password) {
    set({ loading: true });
    // Auth runs entirely client-side against the mock adapter — no backend
    // required. Each successful login restores the full demo experience.
    enableMockMode(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('sadeen.token', data.data.token);
      set({ user: data.data.user, token: data.data.token });
      return data.data.user as AuthUser;
    } finally {
      set({ loading: false });
    }
  },

  async register(input) {
    set({ loading: true });
    enableMockMode(true);
    try {
      const { data } = await api.post('/auth/register', input);
      localStorage.setItem('sadeen.token', data.data.token);
      set({ user: data.data.user, token: data.data.token });
      return data.data.user as AuthUser;
    } finally {
      set({ loading: false });
    }
  },

  async saveOnboarding(input) {
    const { data } = await api.patch('/users/me/onboarding', input);
    set({ user: data.data });
    return data.data as AuthUser;
  },

  async refresh() {
    const { token } = get();
    if (!token) return;
    const { data } = await api.get('/users/me');
    set({ user: data.data });
  },

  logout() {
    localStorage.removeItem('sadeen.token');
    enableMockMode(false);
    set({ user: null, token: null });
  },

  async enterDemoMode(role: Role = 'student') {
    // Reset any previous demo state for a fresh run
    enableMockMode(true);
    resetMockState();
    const overlay: Partial<AuthUser> =
      role === 'teacher'
        ? { _id: 'u-teacher-1', username: 'الأستاذ هشام بلقاسم', email: 'hicham.b@sadeen.dz', role: 'teacher' }
        : role === 'parent'
        ? { _id: 'u-parent-1', username: 'السيّد محمد بوزيد', email: 'm.bouzid@sadeen.dz', role: 'parent' }
        : role === 'admin'
        ? { _id: 'u-admin-1', username: 'المسؤول العام', email: 'admin@sadeen.dz', role: 'admin' }
        : {};
    const user = { ...MOCK_USER, ...overlay } as AuthUser;
    localStorage.setItem('sadeen.token', 'mock-token');
    set({ user, token: 'mock-token' });
    return user;
  }
}));
