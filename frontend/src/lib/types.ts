export type Role = 'student' | 'teacher' | 'parent' | 'admin';
export type MascotPref = 'blue' | 'pink';

export interface AuthUser {
  _id: string;
  username: string;
  email: string;
  role: Role;
  mascotPref: MascotPref;
  xp: number;
  hearts: number;
  streak: number;
  onboarding: { completed: boolean; age?: number; gradeLabel?: string; establishment?: string; dailyGoalXp?: number };
}

export type CourseTopic = 'history' | 'math' | 'coding';

export interface CourseAccent {
  hue: string;
  gradient: string[];
}

export interface Course {
  _id: string;
  slug: string;
  topic: CourseTopic;
  titleAr: string;
  titleEn?: string;
  descriptionAr?: string;
  iconKey?: string;
  illustrationKey?: string;
  accent?: CourseAccent;
  order: number;
  progress?: { total: number; completed: number };
}

export type LessonStatus = 'locked' | 'unlocked' | 'in_progress' | 'completed';

export interface RoadmapLesson {
  _id: string;
  order: number;
  titleAr: string;
  summaryAr?: string;
  illustrationKey?: string;
  xpReward: number;
  status: LessonStatus;
  level?: number;
  levelNameAr?: string;
  levelDifficulty?: 'easy' | 'medium' | 'medium_hard' | 'hard';
  weekIndex?: number;
}

export interface RoadmapResponse {
  course: Course;
  lessons: RoadmapLesson[];
}

export interface ContentBlock {
  type: 'paragraph' | 'callout' | 'image' | 'example' | 'quote';
  textAr?: string;
  imageKey?: string;
  accent?: string;
}

export interface Lesson {
  _id: string;
  courseId: string;
  titleAr: string;
  summaryAr?: string;
  illustrationKey?: string;
  contentBlocks: ContentBlock[];
  expectedReadMs: number;
  hintsAr: string[];
  xpReward: number;
  level?: number;
  levelNameAr?: string;
  levelDifficulty?: 'easy' | 'medium' | 'medium_hard' | 'hard';
  weekIndex?: number;
}

export interface LevelMeta {
  level: number;
  nameAr: string;
  difficulty: 'easy' | 'medium' | 'medium_hard' | 'hard';
}

export type GameType =
  | 'quiz'
  | 'flashcard'
  | 'dragdrop'
  | 'arrowmatch'
  | 'imagepuzzle'
  | 'tankattack';

export interface MiniGameDoc {
  _id: string;
  lessonId: string;
  gameType: GameType;
  order: number;
  instructionAr: string;
  payload: any;
  xpReward: number;
  heartPenalty: number;
}

export interface QuizItemAr {
  questionAr: string;
  optionsAr: string[];
  correctIndex: number;
  explanationAr?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface FlashcardAr {
  id: number;
  frontAr: string;
  backAr: string;
}
