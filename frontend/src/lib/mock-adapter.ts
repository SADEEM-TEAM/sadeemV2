import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import {
  MOCK_USER,
  MOCK_COURSES,
  MOCK_LESSONS,
  findLesson,
  lessonsForCourseSlug,
  courseBySlug,
  mascotReply
} from './mock-data';
import {
  MOCK_DIRECTORY,
  studentsForTeacher,
  kidsForParent,
  teacherById,
  platformOverview,
  dauSeries,
  topicSplit,
  topStudents,
  kidWeeklyXp,
  kidTopicMastery,
  billingForParent
} from './mock-analytics';
import type { AuthUser, Role } from './types';

const STATE_KEY = 'sadeen.mock.state';
const ACCOUNTS_KEY = 'sadeen.mock.accounts';

interface MockState {
  user: AuthUser;
  completedLessons: string[];
  errorsByGame: Record<string, number>;
  readReceipts: Record<string, number>;
  dailyChallengesClaimed?: Record<string, string[]>;
  /** Stable random rank (1-10) the current user lives at on the leaderboard. */
  leaderboardRank?: number;
}

interface MockAccount {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: Role;
}

// Seed with the existing demo creds so the prefilled login form
// (demo@sadeen.dz / demo1234) keeps working for first-time visitors.
const DEFAULT_ACCOUNT: MockAccount = {
  _id: MOCK_USER._id,
  username: MOCK_USER.username,
  email: MOCK_USER.email,
  password: 'demo1234',
  role: 'student'
};

function loadAccounts(): MockAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch {}
  const seeded = [DEFAULT_ACCOUNT];
  saveAccounts(seeded);
  return seeded;
}

function saveAccounts(accounts: MockAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

// Build a fresh demo state for an account: identity fields come from the
// account; XP / hearts / streak / progress all come from MOCK_USER so every
// newly-registered or returning user lands in a fully-populated demo.
function freshStateForAccount(account: MockAccount, opts: { onboarded: boolean }): MockState {
  const onboarding = opts.onboarded
    ? { ...MOCK_USER.onboarding }
    : { completed: false };
  return {
    user: {
      ...MOCK_USER,
      _id: account._id,
      username: account.username,
      email: account.email,
      role: account.role,
      onboarding
    },
    completedLessons: [],
    errorsByGame: {},
    readReceipts: {}
  };
}

function loadState(): MockState {
  const raw = localStorage.getItem(STATE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {}
  }
  const initial: MockState = {
    user: { ...MOCK_USER },
    completedLessons: [],
    errorsByGame: {},
    readReceipts: {}
  };
  saveState(initial);
  return initial;
}
function saveState(s: MockState) {
  localStorage.setItem(STATE_KEY, JSON.stringify(s));
}

function ok<T>(config: InternalAxiosRequestConfig, data: T, status = 200): AxiosResponse<T> {
  return {
    data,
    status,
    statusText: 'OK',
    headers: {},
    config,
    request: {}
  };
}

const matchers: Array<{
  re: RegExp;
  method: 'get' | 'post' | 'patch' | 'delete';
  handle: (m: RegExpMatchArray, config: InternalAxiosRequestConfig, body: any) => any | Promise<any>;
}> = [
  {
    re: /^\/?auth\/register$/,
    method: 'post',
    handle: (_m, _c, body) => {
      const username = String(body?.username ?? '').trim();
      const email = String(body?.email ?? '').trim().toLowerCase();
      const password = String(body?.password ?? '');
      const rawRole = body?.role;
      const role: Role =
        rawRole === 'teacher' || rawRole === 'parent' || rawRole === 'admin' ? rawRole : 'student';

      if (!username || username.length < 2) throw makeError(400, 'اسم المستخدم قصير');
      if (!/^\S+@\S+\.\S+$/.test(email)) throw makeError(400, 'البريد غير صالح');
      if (password.length < 6) throw makeError(400, 'كلمة السر قصيرة (٦ أحرف على الأقل)');

      const accounts = loadAccounts();
      if (accounts.some((a) => a.email === email)) {
        throw makeError(409, 'هذا البريد مستخدم بالفعل');
      }

      const account: MockAccount = {
        _id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        username,
        email,
        password,
        role
      };
      accounts.push(account);
      saveAccounts(accounts);

      // Fresh registration → onboarding incomplete so the registration flow
      // sends them through onboarding before showing the dashboard.
      const state = freshStateForAccount(account, { onboarded: false });
      saveState(state);
      return { ok: true, data: { token: 'mock-token', user: state.user } };
    }
  },
  {
    re: /^\/?auth\/login$/,
    method: 'post',
    handle: (_m, _c, body) => {
      const email = String(body?.email ?? '').trim().toLowerCase();
      const password = String(body?.password ?? '');

      const accounts = loadAccounts();
      const account = accounts.find((a) => a.email === email && a.password === password);
      if (!account) throw makeError(401, 'بيانات الدخول غير صحيحة');

      // Returning user → restore the full demo experience straight to the dashboard.
      const state = freshStateForAccount(account, { onboarded: true });
      saveState(state);
      return { ok: true, data: { token: 'mock-token', user: state.user } };
    }
  },
  {
    re: /^\/?auth\/logout$/,
    method: 'post',
    handle: () => ({ ok: true })
  },
  {
    re: /^\/?users\/me$/,
    method: 'get',
    handle: () => ({ ok: true, data: loadState().user })
  },
  {
    re: /^\/?users\/me\/onboarding$/,
    method: 'patch',
    handle: (_m, _c, body) => {
      const state = loadState();
      state.user = {
        ...state.user,
        mascotPref: body?.mascotPref ?? state.user.mascotPref,
        onboarding: { ...state.user.onboarding, ...body, completed: true }
      };
      saveState(state);
      return { ok: true, data: state.user };
    }
  },
  {
    re: /^\/?users\/me$/,
    method: 'patch',
    handle: (_m, _c, body) => {
      const state = loadState();
      state.user = { ...state.user, ...body };
      saveState(state);
      return { ok: true, data: state.user };
    }
  },
  {
    re: /^\/?courses$/,
    method: 'get',
    handle: () => {
      const state = loadState();
      const data = MOCK_COURSES.map((c) => {
        const total = MOCK_LESSONS.filter((r) => r.courseSlug === c.slug).length;
        const completed = state.completedLessons.filter((id) =>
          MOCK_LESSONS.some((r) => r.courseSlug === c.slug && r.lesson._id === id)
        ).length;
        return { ...c, progress: { total, completed } };
      });
      return { ok: true, data };
    }
  },
  {
    re: /^\/?challenges\/today$/,
    method: 'get',
    handle: () => {
      const state = loadState();
      const today = new Date().toISOString().slice(0, 10);
      // 3 daily challenges, deterministic by day-of-year
      const seed = Number(today.replaceAll('-', '').slice(-4));
      const all = [
        { id: 'math_minute', titleAr: 'دقيقة الحساب', goalAr: 'احلّ ٥ مسائل في 60 ثانية', xp: 30 },
        { id: 'history_flash', titleAr: 'وميض التاريخ', goalAr: 'أتقن 3 بطاقات تاريخية', xp: 25 },
        { id: 'code_quest', titleAr: 'مهمّة المبرمج', goalAr: 'أصلح خطأين في كتل Scratch', xp: 30 },
        { id: 'combo_master', titleAr: 'سيّد الـ Combo', goalAr: 'حقّق مضاعف ×5 في أيّ لعبة', xp: 35 },
        { id: 'quiz_streak', titleAr: 'بطل الاختبارات', goalAr: '10 إجابات صحيحة متتالية بدون مساعدة', xp: 40 }
      ];
      const todays = [
        all[seed % all.length],
        all[(seed + 2) % all.length],
        all[(seed + 4) % all.length]
      ];
      const claimed = state.dailyChallengesClaimed?.[today] ?? [];
      return {
        ok: true,
        data: {
          date: today,
          items: todays.map((c) => ({ ...c, claimed: claimed.includes(c.id) }))
        }
      };
    }
  },
  {
    re: /^\/?challenges\/([^/]+)\/claim$/,
    method: 'post',
    handle: (m) => {
      const state = loadState();
      const today = new Date().toISOString().slice(0, 10);
      state.dailyChallengesClaimed ||= {};
      state.dailyChallengesClaimed[today] ||= [];
      if (!state.dailyChallengesClaimed[today].includes(m[1])) {
        state.dailyChallengesClaimed[today].push(m[1]);
        state.user.xp += 25;
      }
      saveState(state);
      return { ok: true, data: { xp: state.user.xp } };
    }
  },
  {
    re: /^\/?courses\/([^/]+)$/,
    method: 'get',
    handle: (m) => {
      const c = courseBySlug(m[1]);
      if (!c) throw makeError(404, 'Course not found');
      return { ok: true, data: c };
    }
  },
  {
    re: /^\/?lessons\/roadmap\/([^/]+)$/,
    method: 'get',
    handle: (m) => {
      const c = courseBySlug(m[1]);
      if (!c) throw makeError(404, 'Course not found');
      const state = loadState();
      const lessons = lessonsForCourseSlug(m[1]);

      // Group by level → compute the 60% gate per level
      const byLevel: Record<number, typeof lessons> = {};
      for (const l of lessons) {
        const lvl = l.level ?? 1;
        (byLevel[lvl] ||= []).push(l);
      }

      const completedSet = new Set(state.completedLessons);
      const levelGateOpen: Record<number, boolean> = {};
      let prevPassed = true;
      for (const lvl of Object.keys(byLevel).map(Number).sort((a, b) => a - b)) {
        levelGateOpen[lvl] = lvl === 1 ? true : prevPassed;
        const total = byLevel[lvl].length;
        const done = byLevel[lvl].filter((l) => completedSet.has(l._id)).length;
        prevPassed = prevPassed && total > 0 && done / total >= 0.6;
      }

      const out = lessons.map((l, i, all) => {
        const lvl = l.level ?? 1;
        const completed = completedSet.has(l._id);
        if (!levelGateOpen[lvl]) return { ...l, status: 'locked' as const };
        if (completed) return { ...l, status: 'completed' as const };
        // First lesson of an open level is unlocked; others need previous lesson in the same level done.
        const prevSameLevel = all
          .slice(0, i)
          .reverse()
          .find((p) => (p.level ?? 1) === lvl);
        const isFirst = !prevSameLevel;
        if (isFirst) return { ...l, status: 'unlocked' as const };
        return {
          ...l,
          status: completedSet.has(prevSameLevel._id) ? ('unlocked' as const) : ('locked' as const)
        };
      });

      return { ok: true, data: { course: c, lessons: out } };
    }
  },
  {
    re: /^\/?lessons\/([^/]+)\/read-receipt$/,
    method: 'post',
    handle: (m) => {
      const state = loadState();
      state.readReceipts[m[1]] = Date.now();
      saveState(state);
      return { ok: true, data: { issuedAt: new Date().toISOString() } };
    }
  },
  {
    re: /^\/?lessons\/([^/]+)$/,
    method: 'get',
    handle: (m) => {
      const rec = findLesson(m[1]);
      if (!rec) throw makeError(404, 'Lesson not found');
      return { ok: true, data: rec.lesson };
    }
  },
  {
    re: /^\/?games\/lesson\/([^/]+)$/,
    method: 'get',
    handle: (m) => {
      const rec = findLesson(m[1]);
      if (!rec) throw makeError(404, 'Lesson not found');
      return { ok: true, data: rec.games };
    }
  },
  {
    re: /^\/?games\/([^/]+)\/submit$/,
    method: 'post',
    handle: (m, _c, body) => {
      const state = loadState();
      const gameId = m[1];
      const rec = MOCK_LESSONS.find((r) => r.games.some((g) => g._id === gameId));
      if (!rec) throw makeError(404, 'Game not found');
      const game = rec.games.find((g) => g._id === gameId)!;
      const expected = rec.correctAnswers[gameId];
      const correct = checkAnswer(game.gameType, game.payload, expected, body?.answer);

      // Time-Rush quiz can pass {correct, multiplier} per question.
      // Self-grade flashcard can pass {gotIt, total} on completion.
      let xpEarned = 0;
      if (correct) {
        if (game.gameType === 'quiz' && body?.answer && typeof body.answer === 'object') {
          const mult = Number(body.answer.multiplier) || 1;
          xpEarned = Math.round(game.xpReward * mult);
        } else if (game.gameType === 'flashcard' && body?.answer && typeof body.answer === 'object') {
          const gotIt = Number(body.answer.gotIt) || 0;
          const total = Math.max(1, Number(body.answer.total) || 1);
          xpEarned = Math.round(game.xpReward * (gotIt / total));
        } else {
          xpEarned = game.xpReward;
        }
        state.user.xp += xpEarned;
      } else {
        state.user.hearts = Math.max(0, state.user.hearts - game.heartPenalty);
        state.errorsByGame[gameId] = (state.errorsByGame[gameId] || 0) + 1;
      }
      saveState(state);
      return {
        ok: true,
        data: {
          correct,
          gameType: game.gameType,
          xpEarned,
          heartsLost: correct ? 0 : game.heartPenalty,
          hearts: state.user.hearts,
          maxHearts: 5,
          xp: state.user.xp,
          errors: state.errorsByGame[gameId] || 0
        }
      };
    }
  },
  {
    re: /^\/?games\/lesson\/([^/]+)\/complete$/,
    method: 'post',
    handle: (m) => {
      const state = loadState();
      const id = m[1];
      if (!state.completedLessons.includes(id)) state.completedLessons.push(id);
      const rec = findLesson(id);
      if (rec) state.user.xp += rec.lesson.xpReward;
      // bump streak by 1 (capped at 30) for demo flavour
      state.user.streak = Math.min(30, (state.user.streak || 0) + 1);
      saveState(state);
      return {
        ok: true,
        data: {
          lessonId: id,
          completedAt: new Date().toISOString(),
          xp: state.user.xp,
          xpReward: rec?.lesson.xpReward ?? 0
        }
      };
    }
  },
  {
    re: /^\/?progress\/me$/,
    method: 'get',
    handle: () => {
      const state = loadState();
      return {
        ok: true,
        data: state.completedLessons.map((id) => ({ lessonId: id, status: 'completed' }))
      };
    }
  },
  {
    re: /^\/?leaderboard$/,
    method: 'get',
    handle: () => {
      // Ten believable mock students, XP descending so the leaderboard reads naturally.
      // The current user is dropped into a *random* slot (1-10) and inherits that
      // slot's XP/streak so ranking stays internally consistent.
      const ROSTER: Array<{
        _id: string;
        username: string;
        xp: number;
        streak: number;
        mascotPref: 'blue' | 'pink';
      }> = [
        { _id: 'lb-1', username: 'أمين الصدّيق', xp: 920, streak: 14, mascotPref: 'blue' },
        { _id: 'lb-2', username: 'ياسمين بن هادية', xp: 870, streak: 12, mascotPref: 'pink' },
        { _id: 'lb-3', username: 'إيمان شكاوي', xp: 815, streak: 11, mascotPref: 'pink' },
        { _id: 'lb-4', username: 'هشام بن طاهر', xp: 760, streak: 9, mascotPref: 'blue' },
        { _id: 'lb-5', username: 'أنس مكاحلية', xp: 705, streak: 8, mascotPref: 'blue' },
        { _id: 'lb-6', username: 'إيناس مرابط', xp: 640, streak: 7, mascotPref: 'pink' },
        { _id: 'lb-7', username: 'بلال زيدان', xp: 580, streak: 6, mascotPref: 'blue' },
        { _id: 'lb-8', username: 'سارة شاوي', xp: 510, streak: 5, mascotPref: 'pink' },
        { _id: 'lb-9', username: 'لينة معاش', xp: 440, streak: 4, mascotPref: 'pink' },
        { _id: 'lb-10', username: 'كريم بكوش', xp: 380, streak: 3, mascotPref: 'blue' }
      ];

      const state = loadState();
      if (!state.leaderboardRank || state.leaderboardRank < 1 || state.leaderboardRank > 10) {
        state.leaderboardRank = 1 + Math.floor(Math.random() * 10);
        saveState(state);
      }
      const youIdx = state.leaderboardRank - 1;
      const slot = ROSTER[youIdx];

      const data = ROSTER.map((row, i) =>
        i === youIdx
          ? {
              _id: state.user._id,
              username: state.user.username,
              xp: slot.xp,
              streak: slot.streak,
              mascotPref: state.user.mascotPref,
              isMe: true,
              rank: i + 1
            }
          : { ...row, isMe: false, rank: i + 1 }
      );

      return { ok: true, data };
    }
  },
  {
    re: /^\/?mascot\/react$/,
    method: 'post',
    handle: (_m, _c, body) =>
      ({ ok: true, data: mascotReply(body?.context, body?.errorsCount ?? 0, body?.lessonId) })
  },

  // ─── Admin ────────────────────────────────────────────────────────────────
  {
    re: /^\/?admin\/overview$/,
    method: 'get',
    handle: () => ({
      ok: true,
      data: {
        platform: platformOverview(),
        dau: dauSeries(),
        topicSplit: topicSplit(),
        topStudents: topStudents(8)
      }
    })
  },
  {
    re: /^\/?admin\/users$/,
    method: 'get',
    handle: () => ({ ok: true, data: MOCK_DIRECTORY })
  },
  {
    re: /^\/?admin\/users\/([^/]+)$/,
    method: 'patch',
    handle: (m, _c, body) => {
      const u = MOCK_DIRECTORY.find((x) => x._id === m[1]);
      if (!u) throw makeError(404, 'User not found');
      if (body?.role) u.role = body.role;
      return { ok: true, data: u };
    }
  },
  {
    re: /^\/?admin\/users\/([^/]+)$/,
    method: 'delete',
    handle: (m) => {
      const i = MOCK_DIRECTORY.findIndex((x) => x._id === m[1]);
      if (i >= 0) MOCK_DIRECTORY.splice(i, 1);
      return { ok: true };
    }
  },

  // ─── Teacher ──────────────────────────────────────────────────────────────
  {
    re: /^\/?teacher\/overview$/,
    method: 'get',
    handle: () => {
      const teacherId = 'u-teacher-1';
      const students = studentsForTeacher(teacherId);
      const totalStudents = students.length;
      const avgXp = totalStudents
        ? Math.round(students.reduce((s, u) => s + u.xp, 0) / totalStudents)
        : 0;
      const activeToday = students.filter((u) => {
        const days = (Date.now() - new Date(u.lastActive).getTime()) / (1000 * 60 * 60 * 24);
        return days < 1;
      }).length;
      const struggling = students.filter((u) => u.streak < 2).length;
      return {
        ok: true,
        data: {
          summary: { totalStudents, avgXp, activeToday, struggling },
          dau: dauSeries(),
          top: topStudents(6, teacherId)
        }
      };
    }
  },
  {
    re: /^\/?teacher\/students$/,
    method: 'get',
    handle: () => ({ ok: true, data: studentsForTeacher('u-teacher-1') })
  },
  {
    re: /^\/?teacher\/courses$/,
    method: 'get',
    handle: () => {
      // Teacher sees the same 3 courses + the lessons grouped by level
      const data = MOCK_COURSES.map((c) => {
        const lessons = MOCK_LESSONS.filter((r) => r.courseSlug === c.slug).map((r) => ({
          _id: r.lesson._id,
          titleAr: r.lesson.titleAr,
          summaryAr: r.lesson.summaryAr,
          level: r.lesson.level,
          weekIndex: r.lesson.weekIndex,
          xpReward: r.lesson.xpReward,
          gameCount: r.games.length
        }));
        return { ...c, lessons };
      });
      return { ok: true, data };
    }
  },
  {
    re: /^\/?teacher\/lessons$/,
    method: 'post',
    handle: (_m, _c, body) => {
      // Stub create — returns the body with a generated id
      return {
        ok: true,
        data: {
          _id: `t-l-${Date.now()}`,
          titleAr: body?.titleAr ?? 'درس جديد',
          summaryAr: body?.summaryAr ?? '',
          level: body?.level ?? 1,
          weekIndex: body?.weekIndex ?? 1,
          xpReward: body?.xpReward ?? 50
        }
      };
    }
  },
  {
    re: /^\/?teacher\/lessons\/([^/]+)$/,
    method: 'patch',
    handle: (m, _c, body) => ({ ok: true, data: { _id: m[1], ...body } })
  },
  {
    re: /^\/?teacher\/lessons\/([^/]+)$/,
    method: 'delete',
    handle: (m) => ({ ok: true, data: { _id: m[1] } })
  },

  // ─── Parent ───────────────────────────────────────────────────────────────
  {
    re: /^\/?parent\/overview$/,
    method: 'get',
    handle: () => {
      const parentId = 'u-parent-1';
      const kids = kidsForParent(parentId);
      const totalXp = kids.reduce((s, k) => s + k.xp, 0);
      const totalCompleted = kids.reduce((s, k) => s + k.completedLessons, 0);
      return {
        ok: true,
        data: {
          kids,
          summary: { totalXp, totalCompleted, kidsCount: kids.length }
        }
      };
    }
  },
  {
    re: /^\/?parent\/kids\/([^/]+)$/,
    method: 'get',
    handle: (m) => {
      const kid = MOCK_DIRECTORY.find((u) => u._id === m[1]);
      if (!kid) throw makeError(404, 'Kid not found');
      return {
        ok: true,
        data: {
          kid,
          weeklyXp: kidWeeklyXp(m[1]),
          topicMastery: kidTopicMastery(m[1]),
          teacher: kid.teacherId ? teacherById(kid.teacherId) : null
        }
      };
    }
  },
  {
    re: /^\/?parent\/billing$/,
    method: 'get',
    handle: () => ({ ok: true, data: billingForParent('u-parent-1') })
  },
  {
    re: /^\/?parent\/billing\/plan$/,
    method: 'post',
    handle: (_m, _c, _body) => ({ ok: true, data: { changedAt: new Date().toISOString() } })
  }
];

function checkAnswer(gameType: string, payload: any, expected: any, given: any): boolean {
  if (gameType === 'tankattack') return true;
  // Self-grade flashcard sends {gotIt, total} — counts as correct iff gotIt ≥ ceil(total/2).
  if (gameType === 'flashcard') {
    if (given && typeof given === 'object' && 'gotIt' in given) {
      const gotIt = Number(given.gotIt) || 0;
      const total = Math.max(1, Number(given.total) || 1);
      return gotIt / total >= 0.5;
    }
    return true; // legacy: any submit counts as completed
  }
  // Time-Rush quiz: client computes per-question correctness against payload.items[i].correctIndex
  // and sends { correct, multiplier?, itemIndex? } per question.
  if (gameType === 'quiz') {
    if (given && typeof given === 'object' && 'correct' in given) {
      // Optional verification: if itemIndex + choiceIndex provided, reject mismatched claims.
      if (
        payload?.items &&
        typeof given.itemIndex === 'number' &&
        typeof given.choiceIndex === 'number'
      ) {
        const item = payload.items[given.itemIndex];
        return Boolean(item && item.correctIndex === given.choiceIndex);
      }
      return Boolean(given.correct);
    }
    // Legacy single-question quiz (index-based)
    return Number(given) === Number(expected);
  }
  if (gameType === 'dragdrop' || gameType === 'arrowmatch') {
    if (!Array.isArray(given) || !Array.isArray(expected)) return false;
    if (given.length !== expected.length) return false;
    const norm = (a: any[]) =>
      a
        .map((p: any) =>
          gameType === 'arrowmatch' ? `${p.from}->${p.to}` : `${p[0]}:${p[1]}`
        )
        .sort();
    const u = norm(given);
    const c = norm(expected);
    return u.every((v, i) => v === c[i]);
  }
  if (gameType === 'imagepuzzle') {
    if (!Array.isArray(given) || !Array.isArray(expected)) return false;
    return given.every((v, i) => v === expected[i]);
  }
  return true;
}

function makeError(status: number, message: string) {
  const err: any = new Error(message);
  err.response = { status, data: { ok: false, message } };
  return err;
}

export const mockAdapter: AxiosAdapter = async (config) => {
  // Strip the baseURL prefix (e.g. /api/...) — leaving the path we match on.
  let url = config.url || '';
  url = url.replace(/^https?:\/\/[^/]+/, '');
  url = url.replace(/^\/?api\/?/, '/');
  const method = (config.method || 'get').toLowerCase();
  const body = typeof config.data === 'string' ? safeParse(config.data) : config.data;

  for (const m of matchers) {
    if (m.method !== method) continue;
    const cleaned = url.startsWith('/') ? url.slice(1) : url;
    const match = cleaned.match(m.re);
    if (match) {
      try {
        const data = await m.handle(match, config, body);
        return ok(config, data);
      } catch (err: any) {
        return Promise.reject(err);
      }
    }
  }

  // unmatched route → 404
  return ok(config, { ok: false, message: `mock: route not found ${method.toUpperCase()} ${url}` }, 404);
};

function safeParse(s: string) {
  try {
    return JSON.parse(s);
  } catch {
    return s;
  }
}

export function isMockMode() {
  try {
    return localStorage.getItem('sadeen.mock') === '1';
  } catch {
    return false;
  }
}

export function enableMockMode(enabled = true) {
  if (enabled) localStorage.setItem('sadeen.mock', '1');
  else {
    localStorage.removeItem('sadeen.mock');
    localStorage.removeItem(STATE_KEY);
  }
}

export function resetMockState() {
  localStorage.removeItem(STATE_KEY);
  loadState(); // re-seed
}
