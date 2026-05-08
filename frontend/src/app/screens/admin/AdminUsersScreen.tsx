import React, { useEffect, useMemo, useState } from 'react';
import { Search, Trash2, Shield, GraduationCap, BookOpen, Users as UsersIcon } from 'lucide-react';

import { LandingBackdrop } from '../../components/landing/LandingBackdrop';
import { GlassPanel, PanelHeader } from '../../components/data/Charts';
import { api } from '@/lib/api';
import type { Role } from '@/lib/types';

interface DirectoryUser {
  _id: string;
  username: string;
  email: string;
  role: Role;
  xp: number;
  streak: number;
  joinedAt: string;
  lastActive: string;
}

const ROLE_PILL: Record<string, { label: string; color: string; icon: any }> = {
  student: { label: 'تلميذ', color: '#FBBF24', icon: GraduationCap },
  teacher: { label: 'أستاذ', color: '#38BDF8', icon: BookOpen },
  parent: { label: 'وليّ أمر', color: '#34D399', icon: UsersIcon },
  admin: { label: 'مسؤول', color: '#A78BFA', icon: Shield }
};

export function AdminUsersScreen() {
  const [users, setUsers] = useState<DirectoryUser[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Role | 'all'>('all');

  useEffect(() => {
    api.get('/admin/users').then((r) => setUsers(r.data.data));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users
      .filter((u) => filter === 'all' || u.role === filter)
      .filter((u) =>
        !q ? true : u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      )
      .sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime());
  }, [users, search, filter]);

  const remove = async (id: string) => {
    setUsers((u) => u.filter((x) => x._id !== id));
    try {
      await api.delete(`/admin/users/${id}`);
    } catch {
      // re-fetch on failure
      const r = await api.get('/admin/users');
      setUsers(r.data.data);
    }
  };

  return (
    <div className="relative">
      <LandingBackdrop />
      <div className="relative z-10">
        <header className="mb-6">
          <h1 className="text-white" style={{ fontFamily: 'Cairo', fontWeight: 900, fontSize: 28 }}>
            المستخدمون
          </h1>
          <p className="text-white/65" style={{ fontFamily: 'Cairo', fontSize: 14 }}>
            {filtered.length} نتيجة من أصل {users.length}
          </p>
        </header>

        <GlassPanel accent="#FBBF24">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <label
              className="flex items-center gap-2 flex-1 rounded-2xl px-4 py-2.5"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <Search size={16} className="text-white/55" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث بالاسم أو البريد…"
                className="flex-1 bg-transparent outline-none text-white placeholder-white/40"
                style={{ fontFamily: 'Cairo, sans-serif', fontSize: 14 }}
              />
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['all', 'student', 'teacher', 'parent', 'admin'] as const).map((k) => {
                const active = filter === k;
                const meta = k === 'all' ? null : ROLE_PILL[k];
                return (
                  <button
                    key={k}
                    onClick={() => setFilter(k)}
                    className="rounded-full px-3 py-1.5 text-xs"
                    style={{
                      fontFamily: 'Cairo, sans-serif',
                      fontWeight: 800,
                      background: active
                        ? `linear-gradient(135deg, ${meta?.color ?? '#FBBF24'}33, ${meta?.color ?? '#FBBF24'}11)`
                        : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${active ? (meta?.color ?? '#FBBF24') : 'rgba(255,255,255,0.10)'}`,
                      color: 'white'
                    }}
                  >
                    {k === 'all' ? 'الكلّ' : meta!.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/8">
            <div
              className="grid grid-cols-12 px-4 py-2 text-white/55 text-xs"
              style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, background: 'rgba(255,255,255,0.04)' }}
            >
              <div className="col-span-4">المستخدم</div>
              <div className="col-span-2">الدور</div>
              <div className="col-span-2">XP</div>
              <div className="col-span-2">آخر نشاط</div>
              <div className="col-span-2 text-end">إجراء</div>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {filtered.map((u) => {
                const role = ROLE_PILL[u.role];
                const Icon = role.icon;
                return (
                  <div
                    key={u._id}
                    className="grid grid-cols-12 items-center px-4 py-3 border-t border-white/6 hover:bg-white/3"
                  >
                    <div className="col-span-4">
                      <p className="text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 14 }}>
                        {u.username}
                      </p>
                      <p className="text-white/45 truncate" style={{ fontFamily: 'Cairo, sans-serif', fontSize: 12 }}>
                        {u.email}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px]"
                        style={{
                          fontFamily: 'Cairo, sans-serif',
                          fontWeight: 800,
                          background: `${role.color}22`,
                          color: role.color,
                          border: `1px solid ${role.color}55`
                        }}
                      >
                        <Icon size={11} />
                        {role.label}
                      </span>
                    </div>
                    <div className="col-span-2 text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: 13 }}>
                      {u.xp}
                    </div>
                    <div className="col-span-2 text-white/65" style={{ fontFamily: 'Cairo, sans-serif', fontSize: 12 }}>
                      {u.lastActive}
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <button
                        onClick={() => remove(u._id)}
                        className="rounded-full w-8 h-8 grid place-items-center text-rose-300 hover:bg-rose-500/15"
                        title="حذف"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <p className="text-white/55 text-center py-8" style={{ fontFamily: 'Cairo' }}>
                  لا توجد نتائج
                </p>
              )}
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
