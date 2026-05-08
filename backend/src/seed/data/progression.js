// Initial progression data for demo users
// This creates a realistic starting state with some lessons unlocked/completed

module.exports = {
  // Initial user progression state (for the demo user)
  demoUserProgressionSeeds: [
    {
      // Demo user's first level lessons (partially completed)
      levelNumber: 1,
      lessonIndex: 0,
      status: 'completed',
      bestScore: 95,
      completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      errorsByGame: {}
    },
    {
      levelNumber: 1,
      lessonIndex: 1,
      status: 'completed',
      bestScore: 88,
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      errorsByGame: {}
    },
    {
      levelNumber: 1,
      lessonIndex: 2,
      status: 'in_progress',
      bestScore: 65,
      errorsByGame: { 'game-1-2-0': 1, 'game-1-2-1': 2 },
      readReceiptIssuedAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
    }
  ],

  // Deterministic students for teacher dashboard
  studentProgressionSeeds: [
    {
      username: 'أمين',
      email: 'amin.learning@sadeen.dz',
      classroomAr: '1 متوسط أ',
      totalXp: 540,
      streak: 9,
      hearts: 5,
      lastActiveAt: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
      completedLessons: 8,
      inProgressLessons: 1,
      averageScore: 92
    },
    {
      username: 'ياسمين',
      email: 'yasmine.learning@sadeen.dz',
      classroomAr: '1 متوسط أ',
      totalXp: 510,
      streak: 7,
      hearts: 4,
      lastActiveAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      completedLessons: 7,
      inProgressLessons: 2,
      averageScore: 88
    },
    {
      username: 'إيناس',
      email: 'inas.learning@sadeen.dz',
      classroomAr: '1 متوسط ب',
      totalXp: 320,
      streak: 4,
      hearts: 3,
      lastActiveAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      completedLessons: 5,
      inProgressLessons: 1,
      averageScore: 75
    },
    {
      username: 'بلال',
      email: 'bilal.learning@sadeen.dz',
      classroomAr: '1 متوسط ب',
      totalXp: 290,
      streak: 3,
      hearts: 5,
      lastActiveAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      completedLessons: 4,
      inProgressLessons: 1,
      averageScore: 78
    },
    {
      username: 'هاجر',
      email: 'hajar.learning@sadeen.dz',
      classroomAr: '2 متوسط أ',
      totalXp: 450,
      streak: 6,
      hearts: 2,
      lastActiveAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      completedLessons: 6,
      inProgressLessons: 2,
      averageScore: 85
    }
  ],

  // Kids under parent account
  childProgressionSeeds: [
    {
      username: 'علي',
      email: 'ali.child@sadeen.dz',
      parentEmail: 'm.bouzid@sadeen.dz',
      age: 11,
      gradeLabel: 'متوسط 1',
      totalXp: 380,
      streak: 5,
      hearts: 5,
      completedLessons: 6,
      inProgressLessons: 1,
      topicMastery: {
        history: { completedCount: 3, totalCount: 5, percentage: 60 },
        math: { completedCount: 2, totalCount: 5, percentage: 40 },
        coding: { completedCount: 1, totalCount: 4, percentage: 25 }
      }
    },
    {
      username: 'سارة',
      email: 'sara.child@sadeen.dz',
      parentEmail: 'm.bouzid@sadeen.dz',
      age: 9,
      gradeLabel: 'ابتدائي 4',
      totalXp: 210,
      streak: 2,
      hearts: 3,
      completedLessons: 3,
      inProgressLessons: 0,
      topicMastery: {
        history: { completedCount: 1, totalCount: 5, percentage: 20 },
        math: { completedCount: 2, totalCount: 5, percentage: 40 },
        coding: { completedCount: 0, totalCount: 4, percentage: 0 }
      }
    }
  ],

  // Weekly stats for graphs
  weeklyXpSeries: [
    { day: 'الاثنين', xp: 50 },
    { day: 'الثلاثاء', xp: 75 },
    { day: 'الأربعاء', xp: 60 },
    { day: 'الخميس', xp: 90 },
    { day: 'الجمعة', xp: 45 },
    { day: 'السبت', xp: 80 },
    { day: 'الأحد', xp: 70 }
  ],

  // Topic mastery snapshot for analytics
  topicMasterySnapshots: {
    history: {
      enrolled: 15,
      completed: 8,
      inProgress: 4,
      locked: 3,
      averageScore: 82
    },
    math: {
      enrolled: 18,
      completed: 7,
      inProgress: 6,
      locked: 5,
      averageScore: 78
    },
    coding: {
      enrolled: 12,
      completed: 4,
      inProgress: 3,
      locked: 5,
      averageScore: 75
    }
  }
};
