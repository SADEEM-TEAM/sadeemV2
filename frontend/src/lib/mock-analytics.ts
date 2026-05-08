// Deterministic mock data for Admin / Teacher / Parent dashboards.
// All values are seeded so the demo is stable across reloads.

import type { Role } from './types';

export interface MockUser {
  _id: string;
  username: string;
  email: string;
  role: Role;
  xp: number;
  streak: number;
  hearts: number;
  joinedAt: string; // YYYY-MM-DD
  lastActive: string;
  completedLessons: number;
  parentId?: string;
  teacherId?: string;
  classroom?: string;
}

const FIRST_NAMES_AR = [
  'كريم', 'ياسين', 'أحمد', 'سفيان', 'مهدي', 'هشام', 'بلال', 'إيناس', 'ليلى', 'أمينة',
  'هاجر', 'فاطمة', 'مروة', 'صفاء', 'دنيا', 'يحي', 'إسلام', 'منير', 'وسيم', 'وليد',
  'أمين', 'رضا', 'نور', 'مريم', 'سارة', 'هدى', 'سلمى', 'زينب', 'هبة', 'رزان',
  'طارق', 'أنس', 'عمر', 'محمد', 'علي', 'حمزة', 'يونس', 'أيوب', 'إلياس', 'رامي',
  'لينا', 'دارين', 'دينا', 'سمية', 'رانية', 'حياة', 'منى', 'كنزة', 'ندى', 'بشرى'
];
const LAST_NAMES_AR = [
  'بوزيد', 'بن علي', 'حمداني', 'بلقاسم', 'العربي', 'مزيان', 'لعمامرة', 'بنزاهي',
  'كرامي', 'حداد', 'عيساوي', 'بلال', 'مسعودي', 'عماري', 'بوشامة'
];

const CLASSROOMS = ['1 متوسط أ', '1 متوسط ب', '2 متوسط أ', '2 متوسط ب', '3 ثانوي'];

function rand(seed: number) {
  // Lehmer / minstd-style PRNG keyed by seed → deterministic
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const SEED = 42;

function buildUsers(): MockUser[] {
  const r = rand(SEED);
  const users: MockUser[] = [];
  const now = Date.now();

  // 1 teacher (the demo teacher, id stable)
  const TEACHER_ID = 'u-teacher-1';
  // 1 parent
  const PARENT_ID = 'u-parent-1';

  // Demo teacher
  users.push({
    _id: TEACHER_ID,
    username: 'الأستاذ هشام بلقاسم',
    email: 'hicham.b@sadeen.dz',
    role: 'teacher',
    xp: 0,
    streak: 0,
    hearts: 5,
    joinedAt: '2025-09-01',
    lastActive: new Date(now - 1000 * 60 * 60 * 6).toISOString().slice(0, 10),
    completedLessons: 0
  });

  // Demo parent
  users.push({
    _id: PARENT_ID,
    username: 'السيّد محمد بوزيد',
    email: 'm.bouzid@sadeen.dz',
    role: 'parent',
    xp: 0,
    streak: 0,
    hearts: 5,
    joinedAt: '2025-10-12',
    lastActive: new Date(now - 1000 * 60 * 60 * 24).toISOString().slice(0, 10),
    completedLessons: 0
  });

  // Demo admin
  users.push({
    _id: 'u-admin-1',
    username: 'المسؤول العام',
    email: 'admin@sadeen.dz',
    role: 'admin',
    xp: 0,
    streak: 0,
    hearts: 5,
    joinedAt: '2025-08-15',
    lastActive: new Date(now).toISOString().slice(0, 10),
    completedLessons: 0
  });

  // 2 kids of the demo parent — explicit so the parent dashboard always has them
  users.push({
    _id: 'u-kid-1',
    username: 'يحيى بوزيد',
    email: 'yahia@sadeen.dz',
    role: 'student',
    xp: 540,
    streak: 7,
    hearts: 4,
    joinedAt: '2025-10-15',
    lastActive: new Date(now - 1000 * 60 * 60 * 4).toISOString().slice(0, 10),
    completedLessons: 6,
    parentId: PARENT_ID,
    teacherId: TEACHER_ID,
    classroom: '2 متوسط أ'
  });
  users.push({
    _id: 'u-kid-2',
    username: 'ليلى بوزيد',
    email: 'laila@sadeen.dz',
    role: 'student',
    xp: 320,
    streak: 4,
    hearts: 5,
    joinedAt: '2025-11-02',
    lastActive: new Date(now - 1000 * 60 * 60 * 26).toISOString().slice(0, 10),
    completedLessons: 4,
    parentId: PARENT_ID,
    teacherId: TEACHER_ID,
    classroom: '1 متوسط ب'
  });

  // 12 more students under the demo teacher (gives the teacher dashboard enough rows)
  for (let i = 0; i < 12; i++) {
    const fn = FIRST_NAMES_AR[Math.floor(r() * FIRST_NAMES_AR.length)];
    const ln = LAST_NAMES_AR[Math.floor(r() * LAST_NAMES_AR.length)];
    const xp = Math.floor(40 + r() * 700);
    const streak = Math.floor(r() * 14);
    users.push({
      _id: `u-stu-t-${i}`,
      username: `${fn} ${ln}`,
      email: `s${i + 1}@sadeen.dz`,
      role: 'student',
      xp,
      streak,
      hearts: Math.max(1, 5 - Math.floor(r() * 3)),
      joinedAt: '2025-10-01',
      lastActive: new Date(now - Math.floor(r() * 1000 * 60 * 60 * 72)).toISOString().slice(0, 10),
      completedLessons: Math.floor(xp / 60),
      teacherId: TEACHER_ID,
      classroom: CLASSROOMS[Math.floor(r() * CLASSROOMS.length)]
    });
  }

  // 30 random platform-wide users (for admin overview)
  const ROLE_DIST: Role[] = [
    ...Array(20).fill('student'),
    ...Array(5).fill('teacher'),
    ...Array(4).fill('parent'),
    ...Array(1).fill('admin')
  ];
  for (let i = 0; i < ROLE_DIST.length; i++) {
    const role = ROLE_DIST[Math.floor(r() * ROLE_DIST.length)];
    const fn = FIRST_NAMES_AR[Math.floor(r() * FIRST_NAMES_AR.length)];
    const ln = LAST_NAMES_AR[Math.floor(r() * LAST_NAMES_AR.length)];
    const xp = role === 'student' ? Math.floor(20 + r() * 900) : 0;
    users.push({
      _id: `u-rand-${i}`,
      username: `${fn} ${ln}`,
      email: `user${i}@sadeen.dz`,
      role,
      xp,
      streak: Math.floor(r() * 18),
      hearts: 5,
      joinedAt: `2025-${String(6 + Math.floor(r() * 6)).padStart(2, '0')}-${String(1 + Math.floor(r() * 28)).padStart(2, '0')}`,
      lastActive: new Date(now - Math.floor(r() * 1000 * 60 * 60 * 24 * 14)).toISOString().slice(0, 10),
      completedLessons: Math.floor(xp / 80)
    });
  }

  return users;
}

export const MOCK_DIRECTORY: MockUser[] = buildUsers();

export function studentsForTeacher(teacherId: string) {
  return MOCK_DIRECTORY.filter((u) => u.role === 'student' && u.teacherId === teacherId);
}
export function kidsForParent(parentId: string) {
  return MOCK_DIRECTORY.filter((u) => u.role === 'student' && u.parentId === parentId);
}
export function teacherById(id: string) {
  return MOCK_DIRECTORY.find((u) => u._id === id);
}

// ─── Aggregated analytics ──────────────────────────────────────────────────────

export function platformOverview() {
  const total = MOCK_DIRECTORY.length;
  const byRole: Record<Role, number> = { student: 0, teacher: 0, parent: 0, admin: 0 };
  for (const u of MOCK_DIRECTORY) byRole[u.role] += 1;
  const totalXp = MOCK_DIRECTORY.reduce((s, u) => s + u.xp, 0);
  const totalCompleted = MOCK_DIRECTORY.reduce((s, u) => s + u.completedLessons, 0);
  const activeToday = MOCK_DIRECTORY.filter((u) => {
    const days = (Date.now() - new Date(u.lastActive).getTime()) / (1000 * 60 * 60 * 24);
    return days < 1;
  }).length;

  return { total, byRole, totalXp, totalCompleted, activeToday };
}

// 14-day daily-active-users series for the admin chart
export function dauSeries() {
  const r = rand(SEED + 7);
  const out: { day: string; users: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toISOString().slice(5, 10); // MM-DD
    const base = 18 + Math.floor(r() * 14);
    out.push({ day: label, users: base + (i % 3 === 0 ? 6 : 0) });
  }
  return out;
}

// Topic split for admin pie chart
export function topicSplit() {
  return [
    { name: 'تاريخ', value: 42, color: '#F59E0B' },
    { name: 'رياضيات', value: 31, color: '#38BDF8' },
    { name: 'برمجة', value: 27, color: '#34D399' }
  ];
}

// Top students leaderboard (used by admin + teacher)
export function topStudents(limit = 8, teacherId?: string) {
  const pool = teacherId
    ? MOCK_DIRECTORY.filter((u) => u.role === 'student' && u.teacherId === teacherId)
    : MOCK_DIRECTORY.filter((u) => u.role === 'student');
  return [...pool].sort((a, b) => b.xp - a.xp).slice(0, limit);
}

// Per-kid weekly XP series for the parent dashboard
export function kidWeeklyXp(kidId: string) {
  const r = rand(SEED + Number(kidId.split('-').pop()) || 3);
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      day: ['أحد', 'إثن', 'ثلاث', 'أربع', 'خميس', 'جمعة', 'سبت'][d.getDay()],
      xp: Math.floor(20 + r() * 80)
    };
  });
}

// Per-kid topic mastery (radar-ish data, but used as bar)
export function kidTopicMastery(kidId: string) {
  const r = rand(SEED + Number(kidId.split('-').pop()) || 11);
  return [
    { topic: 'تاريخ', value: Math.floor(40 + r() * 60), color: '#F59E0B' },
    { topic: 'رياضيات', value: Math.floor(35 + r() * 60), color: '#38BDF8' },
    { topic: 'برمجة', value: Math.floor(30 + r() * 60), color: '#34D399' }
  ];
}

// Billing data for parents
export function billingForParent(_parentId: string) {
  return {
    plan: 'العائلة الذهبيّة',
    seats: 2,
    used: 2,
    monthlyAmount: 1490, // DZD
    currency: 'دج',
    nextBillingDate: '2026-06-07',
    paymentMethod: { brand: 'CIB', last4: '4521', expires: '11/28' },
    history: [
      { id: 'inv-2026-04', date: '2026-04-07', amount: 1490, status: 'paid' },
      { id: 'inv-2026-03', date: '2026-03-07', amount: 1490, status: 'paid' },
      { id: 'inv-2026-02', date: '2026-02-07', amount: 1490, status: 'paid' }
    ],
    plans: [
      {
        id: 'solo',
        name: 'الفرديّة',
        priceMonthly: 590,
        seats: 1,
        features: ['طفل واحد', 'كلّ المواد', 'تقارير أسبوعية']
      },
      {
        id: 'family',
        name: 'العائلة الذهبيّة',
        priceMonthly: 1490,
        seats: 4,
        features: ['حتى 4 أبناء', 'كلّ المواد', 'تقارير شهرية مفصّلة', 'دعم أولوية'],
        recommended: true
      },
      {
        id: 'school',
        name: 'المدرسة',
        priceMonthly: 9900,
        seats: 30,
        features: ['حتى 30 تلميذ', 'لوحة أستاذ مدمجة', 'تكامل مع الإدارة']
      }
    ]
  };
}
