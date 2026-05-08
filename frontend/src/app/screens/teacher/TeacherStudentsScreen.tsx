import React, { useEffect, useMemo, useState } from 'react';
import { Search, Flame, Star, MessageSquare } from 'lucide-react';

import { LandingBackdrop } from '../../components/landing/LandingBackdrop';
import { GlassPanel } from '../../components/data/Charts';
import { api } from '@/lib/api';

interface Student {
  _id: string;
  username: string;
  email: string;
  xp: number;
  streak: number;
  classroom?: string;
  completedLessons: number;
  lastActive: string;
}

export function TeacherStudentsScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  useEffect(() => {
    api.get('/teacher/students').then((r) => setStudents(r.data.data));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return students.filter((s) => !q || s.username.toLowerCase().includes(q));
  }, [students, search]);

  return (
    <div className="relative">
      <LandingBackdrop />
      <div className="relative z-10">
        <header className="mb-6">
          <h1 className="text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 900, fontSize: 28 }}>
            تلاميذي
          </h1>
          <p className="text-white/65" style={{ fontFamily: 'Cairo, sans-serif', fontSize: 14 }}>
            {filtered.length} تلميذاً تحت إشرافك
          </p>
        </header>

        <GlassPanel accent="#FBBF24">
          <label
            className="flex items-center gap-2 mb-4 rounded-2xl px-4 py-2.5"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <Search size={16} className="text-white/55" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث بالاسم…"
              className="flex-1 bg-transparent outline-none text-white placeholder-white/40"
              style={{ fontFamily: 'Cairo, sans-serif', fontSize: 14 }}
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((s) => (
              <div
                key={s._id}
                className="rounded-2xl p-4"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.10)'
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-white truncate" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: 15 }}>
                      {s.username}
                    </p>
                    {s.classroom && (
                      <p className="text-white/55" style={{ fontFamily: 'Cairo, sans-serif', fontSize: 11 }}>
                        {s.classroom}
                      </p>
                    )}
                  </div>
                  <button
                    className="rounded-full w-8 h-8 grid place-items-center text-white/65 hover:text-white"
                    style={{ background: 'rgba(167,139,250,0.18)', border: '1px solid rgba(167,139,250,0.35)' }}
                    title="مراسلة"
                  >
                    <MessageSquare size={14} />
                  </button>
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  <span className="inline-flex items-center gap-1 text-yellow-300">
                    <Star size={12} fill="#FACC15" />
                    {s.xp} XP
                  </span>
                  <span className="inline-flex items-center gap-1 text-orange-300">
                    <Flame size={12} />
                    {s.streak} يوم
                  </span>
                  <span className="text-white/55">{s.completedLessons} درس</span>
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, (s.xp / 800) * 100)}%`,
                      background: 'linear-gradient(90deg, #FBBF24, #F59E0B)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
