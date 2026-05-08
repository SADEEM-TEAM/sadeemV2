// Gamification configuration that mirrors frontend mock data
// Defines XP rewards, heart penalties, and progression logic
// Used to seed Progress and calculate user stats

const GAMIFICATION_CONFIG = {
  // XP Rewards by game type and difficulty
  xpRewards: {
    quiz: { easy: 10, medium: 15, hard: 25, multiplier: 1.5 }, // Time-Rush multiplier
    flashcard: { easy: 5, medium: 8, hard: 12 },
    dragdrop: { easy: 8, medium: 12, hard: 20 },
    arrowmatch: { easy: 8, medium: 12, hard: 20 },
    imagepuzzle: { easy: 10, medium: 15, hard: 25 },
    tankattack: { easy: 15, medium: 25, hard: 40 }
  },

  // Heart penalties by game type
  heartPenalties: {
    quiz: 1,
    flashcard: 0, // Self-grading, no penalty
    dragdrop: 1,
    arrowmatch: 1,
    imagepuzzle: 1,
    tankattack: 2 // Tank attack is harder
  },

  // Lesson completion XP rewards (bonus)
  lessonBonusXp: {
    level1: 50,
    level2: 75,
    level3: 100,
    level4: 150
  },

  // Daily challenge rewards (seeded deterministically in mock)
  dailyChallenges: [
    { id: 'math_minute', titleAr: 'دقيقة الحساب', goalAr: 'احلّ ٥ مسائل في 60 ثانية', xp: 30 },
    { id: 'history_flash', titleAr: 'وميض التاريخ', goalAr: 'أتقن 3 بطاقات تاريخية', xp: 25 },
    { id: 'code_quest', titleAr: 'مهمّة المبرمج', goalAr: 'أصلح خطأين في كتل Scratch', xp: 30 },
    { id: 'combo_master', titleAr: 'سيّد الـ Combo', goalAr: 'حقّق مضاعف ×5 في أيّ لعبة', xp: 35 },
    { id: 'quiz_streak', titleAr: 'بطل الاختبارات', goalAr: '10 إجابات صحيحة متتالية بدون مساعدة', xp: 40 }
  ],

  // Streak logic
  streak: {
    minDailyLessonsToMaintain: 1,
    heartRecovery: {
      intervalHours: 4,
      perInterval: 1,
      maxHearts: 5
    }
  },

  // Progression gates (60% of level must be complete to unlock next)
  progressionGates: {
    level1: { unlocked: true }, // Always unlocked
    level2: { gatePercentage: 0.6 }, // 60% of level 1 needed
    level3: { gatePercentage: 0.6 }, // 60% of level 2 needed
    level4: { gatePercentage: 0.6 } // 60% of level 3 needed
  }
};

// Progression status enum (mirrors frontend)
const PROGRESSION_STATUSES = {
  LOCKED: 'locked',
  UNLOCKED: 'unlocked',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
};

// Achievement system (extensible for future)
const ACHIEVEMENTS = {
  FIRST_LESSON: { id: 'first_lesson', titleAr: 'بداية جديدة', descAr: 'أكمل درسك الأول' },
  WEEK_STREAK_7: { id: 'week_streak_7', titleAr: 'أسبوع متكامل', descAr: 'حافظ على سلسلة لمدة 7 أيام' },
  LEVEL_MASTER: { id: 'level_master', titleAr: 'سيّد المستوى', descAr: 'أكمل جميع دروس مستوى' },
  COURSE_MASTER: { id: 'course_master', titleAr: 'خبير المادة', descAr: 'أكمل جميع دروس مادة كاملة' },
  PERFECT_GAME: { id: 'perfect_game', titleAr: 'لعبة مثالية', descAr: 'اجتز لعبة بدون أخطاء' },
  SPEED_DEMON: { id: 'speed_demon', titleAr: 'سريع البديهة', descAr: 'احصل على مضاعف ×10 في لعبة' }
};

module.exports = {
  GAMIFICATION_CONFIG,
  PROGRESSION_STATUSES,
  ACHIEVEMENTS
};
