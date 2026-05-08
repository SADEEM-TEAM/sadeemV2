// Mock content layer — mirrors the backend seed so the app is fully usable without a server.
// Backed by curriculum.ts (12 lesson packs across 3 subjects × 4 levels).

import type {
  AuthUser,
  Course,
  Lesson,
  MiniGameDoc,
  RoadmapLesson
} from './types';
import { LESSON_PACKS } from './curriculum';

export const MOCK_USER: AuthUser = {
  _id: 'mock-user-id',
  username: 'كريم',
  email: 'demo@sadeen.dz',
  role: 'student',
  mascotPref: 'blue',
  xp: 120,
  hearts: 5,
  streak: 3,
  onboarding: { completed: true, age: 12, gradeLabel: 'متوسط 1', dailyGoalXp: 30 }
};

export const MOCK_COURSES: Course[] = [
  {
    _id: 'c-history',
    slug: 'history',
    topic: 'history',
    titleAr: 'تاريخ الجزائر',
    titleEn: 'Algerian History',
    descriptionAr: 'رحلة عبر الزمن في تاريخ الجزائر، تبدأ بالذكرى الخالدة 8 ماي 1945.',
    iconKey: 'scroll',
    illustrationKey: 'history_hero',
    accent: { hue: 'amber', gradient: ['#F59E0B', '#B45309', '#78350F'] },
    order: 0
  },
  {
    _id: 'c-math',
    slug: 'math',
    topic: 'math',
    titleAr: 'الرياضيات',
    titleEn: 'Mathematics',
    descriptionAr: 'من الأعداد إلى الجبر، تعلّم الرياضيات بطريقة بصرية وممتعة.',
    iconKey: 'sigma',
    illustrationKey: 'math_hero',
    accent: { hue: 'cyan', gradient: ['#06B6D4', '#3B82F6', '#1E3A8A'] },
    order: 1
  },
  {
    _id: 'c-coding',
    slug: 'coding',
    topic: 'coding',
    titleAr: 'البرمجة',
    titleEn: 'Coding Basics',
    descriptionAr: 'فكّر مثل المبرمج: المنطق، الخوارزميات، وحلّ المشكلات.',
    iconKey: 'code',
    illustrationKey: 'coding_hero',
    accent: { hue: 'emerald', gradient: ['#10B981', '#06B6D4', '#0EA5E9'] },
    order: 2
  }
];

const COURSE_ID_BY_SLUG: Record<string, string> = {
  history: 'c-history',
  math: 'c-math',
  coding: 'c-coding'
};

interface MockLessonRecord {
  lesson: Lesson;
  games: MiniGameDoc[];
  correctAnswers: Record<string, any>;
  courseSlug: 'history' | 'math' | 'coding';
}

// Materialize lesson packs into stable IDs and full Lesson/MiniGameDoc shapes.
export const MOCK_LESSONS: MockLessonRecord[] = LESSON_PACKS.map((pack, packIdx) => {
  const lessonId = `l-${pack.courseSlug}-L${pack.level}-W${pack.weekIndex}`;
  const courseId = COURSE_ID_BY_SLUG[pack.courseSlug];

  const games: MiniGameDoc[] = pack.games.map((g, gameIdx) => ({
    _id: `g-${pack.courseSlug}-L${pack.level}-W${pack.weekIndex}-${gameIdx}`,
    lessonId,
    gameType: g.gameType,
    order: gameIdx,
    instructionAr: g.instructionAr,
    payload: g.payload,
    xpReward: g.xpReward,
    heartPenalty: g.heartPenalty
  }));

  // Build correctAnswers map for non-self-checking games (arrowmatch + dragdrop).
  const correctAnswers: Record<string, any> = {};
  games.forEach((doc, gameIdx) => {
    const spec = pack.games[gameIdx];
    if (spec.gameType === 'arrowmatch') {
      const left = (spec.payload as any).leftAr as Array<{ id: string }>;
      const right = (spec.payload as any).rightAr as Array<{ id: string }>;
      correctAnswers[doc._id] = left.map((l, i) => ({ from: l.id, to: right[i]?.id }));
    } else if (spec.gameType === 'dragdrop') {
      const sources = (spec.payload as any).sourcesAr as Array<{ id: number | string }>;
      const targets = (spec.payload as any).targetsAr as Array<{ id: number | string }>;
      correctAnswers[doc._id] = sources.map((s, i) => [s.id, targets[i]?.id]);
    } else if (spec.gameType === 'imagepuzzle') {
      const cols = (spec.payload as any).cols ?? 3;
      const rows = (spec.payload as any).rows ?? 2;
      correctAnswers[doc._id] = Array.from({ length: cols * rows }, (_, i) => i);
    }
    // quiz / flashcard / tankattack are self-checking via payload semantics.
  });

  const lesson: Lesson = {
    _id: lessonId,
    courseId,
    titleAr: pack.lesson.titleAr,
    summaryAr: pack.lesson.summaryAr,
    illustrationKey: pack.lesson.illustrationKey,
    contentBlocks: pack.lesson.contentBlocks,
    expectedReadMs: pack.lesson.expectedReadMs,
    hintsAr: pack.lesson.hintsAr,
    xpReward: pack.lesson.xpReward,
    level: pack.level,
    levelNameAr: pack.lesson.levelNameAr,
    levelDifficulty: pack.lesson.levelDifficulty,
    weekIndex: pack.weekIndex
  };

  return { lesson, games, correctAnswers, courseSlug: pack.courseSlug };
});

export function findLesson(id: string) {
  return MOCK_LESSONS.find((r) => r.lesson._id === id);
}

export function lessonsForCourseSlug(slug: string): RoadmapLesson[] {
  const filtered = MOCK_LESSONS.filter((r) => r.courseSlug === slug);
  filtered.sort((a, b) => {
    const al = a.lesson.level ?? 0;
    const bl = b.lesson.level ?? 0;
    if (al !== bl) return al - bl;
    return (a.lesson.weekIndex ?? 0) - (b.lesson.weekIndex ?? 0);
  });
  return filtered.map((r, i) => ({
    _id: r.lesson._id,
    order: i,
    titleAr: r.lesson.titleAr,
    summaryAr: r.lesson.summaryAr,
    illustrationKey: r.lesson.illustrationKey,
    xpReward: r.lesson.xpReward,
    status: 'unlocked',
    level: r.lesson.level,
    levelNameAr: r.lesson.levelNameAr,
    levelDifficulty: r.lesson.levelDifficulty,
    weekIndex: r.lesson.weekIndex
  }));
}

export function courseBySlug(slug: string) {
  return MOCK_COURSES.find((c) => c.slug === slug);
}

const MASCOT_LINES: Record<string, string[]> = {
  lesson_start: ['ركّز معي، الدرس قصير وممتع.', 'هيا نبدأ! اقرأ بهدوء وفكّر معي.'],
  errors_three: ['لا بأس! المحاولة جزء من التعلّم. ركّز معي مرة أخرى.', 'أنت قريب من الإجابة، تنفّس وحاول مجدّداً.'],
  celebrate: ['أحسنت! إجابة ممتازة!', 'رائع! تستحق نجمة كبيرة.'],
  dashboard_first_visit: ['أهلاً بك! متحمس جدّاً للتعلّم معك اليوم.', 'مرحبا! تجهّز لرحلة معرفية ممتعة.']
};

export function mascotReply(context: string, errorsCount: number, lessonId?: string) {
  let expression = 'happy';
  let messageAr = MASCOT_LINES.dashboard_first_visit[0];
  let hintAr: string | null = null;
  if (context === 'lesson_start') {
    expression = 'thinking';
    messageAr = pick(MASCOT_LINES.lesson_start);
  } else if (context === 'errors_three' && errorsCount >= 3) {
    expression = 'thinking';
    messageAr = pick(MASCOT_LINES.errors_three);
    if (lessonId) {
      const rec = findLesson(lessonId);
      if (rec?.lesson.hintsAr?.length) hintAr = pick(rec.lesson.hintsAr);
    }
  } else if (context === 'celebrate') {
    expression = 'celebrating';
    messageAr = pick(MASCOT_LINES.celebrate);
  } else if (context === 'dashboard_first_visit') {
    expression = 'happy';
    messageAr = pick(MASCOT_LINES.dashboard_first_visit);
  }
  return { mascot: 'blue', expression, messageAr, hintAr };
}

function pick<T>(xs: T[]) {
  return xs[Math.floor(Math.random() * xs.length)];
}
