// Curriculum-faithful content extracted from gamified_courses_curriculum.json.
// 3 subjects (history / math / coding) × 4 levels × 1 representative lesson each.
// Multi-game lesson packs use the upgraded Quiz (Time Rush) and Flashcard (Progressive Reveal + Self-Grade) variations.

import type { ContentBlock, FlashcardAr, Lesson, LevelMeta, MiniGameDoc, QuizItemAr } from './types';

export const LEVELS: LevelMeta[] = [
  { level: 1, nameAr: 'أساسيات', difficulty: 'easy' },
  { level: 2, nameAr: 'متوسط', difficulty: 'medium' },
  { level: 3, nameAr: 'متقدّم', difficulty: 'medium_hard' },
  { level: 4, nameAr: 'إتقان', difficulty: 'hard' }
];

interface LessonPack {
  courseSlug: 'history' | 'math' | 'coding';
  level: number;
  weekIndex: number;
  lesson: Omit<Lesson, '_id' | 'courseId'>;
  games: Array<Omit<MiniGameDoc, '_id' | 'lessonId'>>;
  correctAnswers: Record<string, any>;
}

const blocks = (xs: ContentBlock[]) => xs;

const MAKE_QUIZ = (items: QuizItemAr[], opts: { instructionAr: string; xpReward?: number; timePerQuestion?: number; lifeline50_50?: boolean } = { instructionAr: '' }) => ({
  gameType: 'quiz' as const,
  order: 0,
  instructionAr: opts.instructionAr,
  xpReward: opts.xpReward ?? 12,
  heartPenalty: 1,
  payload: {
    timeRush: true,
    timePerQuestionMs: (opts.timePerQuestion ?? 22) * 1000,
    lifeline50_50: opts.lifeline50_50 ?? true,
    items
  }
});

const MAKE_FLASHCARDS = (cards: FlashcardAr[], opts: { instructionAr: string; xpReward?: number; progressiveReveal?: boolean } = { instructionAr: '' }) => ({
  gameType: 'flashcard' as const,
  order: 0,
  instructionAr: opts.instructionAr,
  xpReward: opts.xpReward ?? 8,
  heartPenalty: 1,
  payload: {
    progressiveReveal: opts.progressiveReveal ?? true,
    selfGrade: true,
    cardsAr: cards
  }
});

// Tank Attack — the climactic mini-game we drop into each topic's last lesson.
// `questionsAr` is the bank we sample from; the player survives `waves` rounds.
interface TankQuestion {
  questionAr: string;
  correctAr: string;
  wrongAr: string[];
}
const MAKE_TANK_ATTACK = (
  questions: TankQuestion[],
  opts: { instructionAr: string; xpReward?: number; waves?: number } = { instructionAr: '' }
) => ({
  gameType: 'tankattack' as const,
  order: 0,
  instructionAr: opts.instructionAr,
  xpReward: opts.xpReward ?? 30,
  heartPenalty: 1,
  payload: {
    waves: opts.waves ?? 5,
    questionsAr: questions
  }
});

// ─── HISTORY ──────────────────────────────────────────────────────────────────

const HISTORY_L1: LessonPack = {
  courseSlug: 'history',
  level: 1,
  weekIndex: 1,
  lesson: {
    level: 1,
    levelNameAr: 'الجزائر القديمة',
    levelDifficulty: 'easy',
    weekIndex: 1,
    titleAr: 'مملكة نوميديا والملك ماسينيسا',
    summaryAr: 'تعرّف على البربر والنوميديين، أعظم فرسان شمال إفريقيا.',
    illustrationKey: 'numidia',
    expectedReadMs: 14_000,
    xpReward: 50,
    hintsAr: [
      'ماسينيسا وحّد مملكة نوميديا حوالي 200 ق.م.',
      'الفرسان النوميديون كانوا الأسرع في زمنهم.',
      'يوغرطة ابن ملك ربّاه ماسينيسا.'
    ],
    contentBlocks: blocks([
      {
        type: 'paragraph',
        textAr:
          'البربر هم أوّل من سكنوا شمال إفريقيا. أسّسوا حضارة نوميديا التي امتدّت في الجزائر الحالية وأجزاء من تونس قبل وصول الرومان.'
      },
      {
        type: 'callout',
        textAr:
          'الملك ماسينيسا (148 ق.م) وحّد القبائل النوميدية وبنى مملكة قويّة، اشتهرت بفرسانها الذين غيّروا قواعد الحرب في حوض المتوسّط.',
        accent: 'amber'
      },
      {
        type: 'paragraph',
        textAr:
          'ابن أخيه يوغرطة قاوم روما لاحقاً، لكن النفوذ الرومانيّ سيطر تدريجياً، وامتزجت الثقافة البربرية مع الرومانية لتشكّل وجهاً جديداً للجزائر القديمة.'
      }
    ])
  },
  games: [
    MAKE_FLASHCARDS(
      [
        { id: 1, frontAr: 'ماسينيسا', backAr: 'وحّد نوميديا، اشتهر بفرسانه الخفيفة.' },
        { id: 2, frontAr: 'يوبا الأوّل', backAr: 'حكم 60 سنة، مملكة متعدّدة الثقافات.' },
        { id: 3, frontAr: 'يوبا الثاني', backAr: 'ابن يوبا الأوّل، ملك مثقّف وعالم.' },
        { id: 4, frontAr: 'الفرسان النوميديون', backAr: 'خيل خفيفة سريعة — تكتيك "اضرب واهرب".' },
        { id: 5, frontAr: 'سيفاكس', backAr: 'ملك منافس عارض ماسينيسا.' },
        { id: 6, frontAr: 'قرطاج', backAr: 'حليف بعض الملوك النوميديين.' },
        { id: 7, frontAr: 'روما', backAr: 'احتلّت نوميديا في النهاية.' },
        { id: 8, frontAr: '300 ق.م', backAr: 'بداية تقريبية لمملكة نوميديا.' }
      ],
      { instructionAr: 'ادرس ملوك نوميديا — اكشف الإجابة، ثم قيّم نفسك.', xpReward: 8 }
    ),
    MAKE_QUIZ(
      [
        {
          questionAr: 'من هو الملك الذي وحّد مملكة نوميديا؟',
          optionsAr: ['يوبا الأوّل', 'سيفاكس', 'ماسينيسا', 'يوغرطة'],
          correctIndex: 2,
          explanationAr: 'ماسينيسا (148 ق.م) وحّد القبائل النوميدية في مملكة قويّة.',
          difficulty: 'easy'
        },
        {
          questionAr: 'بماذا اشتهر الجيش النوميديّ؟',
          optionsAr: ['الأسطول البحريّ', 'الفرسان الخفيفة', 'المنجنيق', 'الرّماة بالقوس'],
          correctIndex: 1,
          explanationAr: 'الفرسان النوميديّون استخدموا تكتيك "الضرب والهرب" بسرعة فائقة.',
          difficulty: 'easy'
        },
        {
          questionAr: 'مَن قاوم روما من ملوك نوميديا؟',
          optionsAr: ['يوغرطة', 'سيفاكس', 'يوبا الثاني', 'جايا'],
          correctIndex: 0,
          explanationAr: 'يوغرطة قاد حرباً طويلة ضدّ روما (112-105 ق.م).',
          difficulty: 'medium'
        },
        {
          questionAr: 'صحّ أو خطأ: الثقافة البربرية اختفت تماماً تحت الحكم الرومانيّ.',
          optionsAr: ['صحّ', 'خطأ'],
          correctIndex: 1,
          explanationAr: 'بل امتزجت مع الرومانية وبقيت لغة وعادات حيّة إلى اليوم.',
          difficulty: 'easy'
        }
      ],
      { instructionAr: 'سباق الزمن — أجب بسرعة لمضاعفة النقاط.', xpReward: 14, timePerQuestion: 22 }
    )
  ],
  correctAnswers: {}
};

const HISTORY_L2: LessonPack = {
  courseSlug: 'history',
  level: 2,
  weekIndex: 1,
  lesson: {
    level: 2,
    levelNameAr: 'العصر الإسلاميّ',
    levelDifficulty: 'medium',
    weekIndex: 1,
    titleAr: 'الكاهنة وانتشار الإسلام في المغرب',
    summaryAr: 'الفتح الإسلاميّ، ومقاومة ديهيا الكاهنة.',
    illustrationKey: 'kahina',
    expectedReadMs: 16_000,
    xpReward: 55,
    hintsAr: [
      'ديهيا قاومت الفتح الإسلاميّ نحو 30 سنة.',
      'الأمويّون أوّل من حكم شمال إفريقيا (661-750م).',
      'تلمسان عاصمة العلم في الغرب الإسلاميّ.'
    ],
    contentBlocks: blocks([
      {
        type: 'paragraph',
        textAr:
          'وصل الإسلام إلى المغرب نهاية القرن السابع الميلاديّ. اعتنقه كثير من البربر، وقاوم بعضهم — وأشهر هؤلاء الملكة ديهيا (الكاهنة) من جبال الأوراس.'
      },
      {
        type: 'callout',
        textAr:
          'الكاهنة قادت تحالفاً قبلياً وقاومت الفتح من حصنها الجبليّ "تافوت" قرابة 30 سنة، لتُصبح رمزاً للأصالة البربرية.',
        accent: 'amber'
      },
      {
        type: 'paragraph',
        textAr:
          'بعد الكاهنة، تتالت الدول الإسلامية: الأمويّون ثمّ العبّاسيّون، وتفتّحت تلمسان وبجاية وقسنطينة كمراكز علم وعمارة وتجارة.'
      }
    ])
  },
  games: [
    MAKE_FLASHCARDS(
      [
        { id: 1, frontAr: 'ديهيا (الكاهنة)', backAr: 'ملكة بربرية قاومت الفتح الإسلاميّ ثلاثين سنة.' },
        { id: 2, frontAr: 'تافوت', backAr: 'حصن الكاهنة في جبال الأوراس.' },
        { id: 3, frontAr: 'الأمويّون', backAr: 'أوّل دولة إسلامية تحكم المغرب (661-750م).' },
        { id: 4, frontAr: 'العبّاسيّون', backAr: 'الدولة الإسلامية الثانية (750-1258م).' },
        { id: 5, frontAr: 'تلمسان', backAr: 'مدينة في غرب الجزائر، عاصمة علم وعمارة.' },
        { id: 6, frontAr: 'قسنطينة', backAr: 'مدينة شرقية تشتهر بجسورها المعلّقة.' },
        { id: 7, frontAr: 'الإفريقية', backAr: 'الاسم الإسلاميّ القديم لشمال إفريقيا.' }
      ],
      { instructionAr: 'بطاقات العصر الإسلاميّ — قيّم تذكّرك بصدق.', xpReward: 8 }
    ),
    MAKE_QUIZ(
      [
        {
          questionAr: 'كم سنة قاومت الكاهنة الفتح الإسلاميّ تقريباً؟',
          optionsAr: ['10 سنوات', '20 سنة', '30 سنة', '50 سنة'],
          correctIndex: 2,
          explanationAr: 'قاومت قرابة 30 سنة قبل أن تُهزم.',
          difficulty: 'medium'
        },
        {
          questionAr: 'في أيّ جبال كانت الكاهنة تتحصّن؟',
          optionsAr: ['الهقّار', 'الأوراس', 'جرجرة', 'الونشريس'],
          correctIndex: 1,
          explanationAr: 'حصنها "تافوت" في جبال الأوراس.',
          difficulty: 'medium'
        },
        {
          questionAr: 'متى انتهى حكم الأمويّين؟',
          optionsAr: ['650م', '750م', '850م', '950م'],
          correctIndex: 1,
          explanationAr: 'الدولة الأموية حكمت 661-750م.',
          difficulty: 'medium'
        }
      ],
      { instructionAr: 'سباق الزمن — أجب بسرعة قبل انتهاء الوقت.', xpReward: 14 }
    )
  ],
  correctAnswers: {}
};

const HISTORY_L3: LessonPack = {
  courseSlug: 'history',
  level: 3,
  weekIndex: 1,
  lesson: {
    level: 3,
    levelNameAr: 'العصر العثمانيّ والاستعمار',
    levelDifficulty: 'medium_hard',
    weekIndex: 1,
    titleAr: 'بربروس والمقاومة البحرية',
    summaryAr: 'كيف أصبحت الجزائر إيالة بحرية مهابة في المتوسّط.',
    illustrationKey: 'barbarossa',
    expectedReadMs: 16_000,
    xpReward: 60,
    hintsAr: [
      'خير الدين بربروس قائد بحريّ عثمانيّ.',
      'القراصنة البربر كانوا حماة سواحل الإيالة.',
      'الإيالة الجزائرية حكمها الدايات.'
    ],
    contentBlocks: blocks([
      {
        type: 'paragraph',
        textAr:
          'في القرن السادس عشر، حماية المغرب من التوسّع الإسبانيّ والبرتغاليّ تطلّبت قوّة بحرية. جاء الأخوان عروج وخير الدين (بربروس) لقيادة الأسطول الجزائريّ تحت رعاية الدولة العثمانية.'
      },
      {
        type: 'callout',
        textAr:
          '"بربروس" تعني اللحية الحمراء — اسم اشتُهر به خير الدين في أوروبا. غدت الجزائر بفضله إيالة بحرية تخشاها أساطيل المتوسّط.',
        accent: 'amber'
      },
      {
        type: 'paragraph',
        textAr:
          'تحت الحكم العثمانيّ ظهر منصب الداي حاكماً، والآغا قائداً عسكرياً، والقاضي حاكماً للقضاء. ازدهرت الجزائر العاصمة كميناء عالميّ حتّى الغزو الفرنسيّ سنة 1830.'
      }
    ])
  },
  games: [
    MAKE_FLASHCARDS(
      [
        { id: 1, frontAr: 'خير الدين بربروس', backAr: 'قائد بحريّ، دافع عن سواحل المغرب.' },
        { id: 2, frontAr: 'بربروس', backAr: 'تعني "اللحية الحمراء" بالإيطالية.' },
        { id: 3, frontAr: 'الداي', backAr: 'حاكم الإيالة الجزائرية في العهد العثمانيّ.' },
        { id: 4, frontAr: 'الآغا', backAr: 'قائد الجيش — الوحدات النخبة (الإنكشارية).' },
        { id: 5, frontAr: 'القاضي', backAr: 'حاكم في الشريعة الإسلامية.' },
        { id: 6, frontAr: '1830', backAr: 'سنة بدء الغزو الفرنسيّ للجزائر.' },
        { id: 7, frontAr: 'وهران', backAr: 'مدينة احتلّها الإسبان قبل تحريرها.' }
      ],
      { instructionAr: 'بطاقات العهد العثمانيّ.', xpReward: 8 }
    ),
    MAKE_QUIZ(
      [
        {
          questionAr: 'ماذا تعني كلمة "بربروس"؟',
          optionsAr: ['الفاتح', 'اللحية الحمراء', 'الأسد', 'البحّار'],
          correctIndex: 1,
          explanationAr: 'لقّب الإيطاليّون خير الدين بهذا اللقب بسبب لحيته.',
          difficulty: 'medium'
        },
        {
          questionAr: 'ما هو لقب حاكم الإيالة الجزائرية في العهد العثمانيّ؟',
          optionsAr: ['السلطان', 'الداي', 'الباشا', 'الأمير'],
          correctIndex: 1,
          explanationAr: 'الداي هو الحاكم — منتخب من الإنكشارية والقادة.',
          difficulty: 'medium'
        },
        {
          questionAr: 'متى بدأ الغزو الفرنسيّ للجزائر؟',
          optionsAr: ['1815', '1830', '1845', '1860'],
          correctIndex: 1,
          explanationAr: 'في 14 جوان 1830 نزل الجيش الفرنسيّ في سيدي فرج.',
          difficulty: 'medium'
        }
      ],
      { instructionAr: 'سباق الزمن — العصر العثمانيّ.', xpReward: 14 }
    )
  ],
  correctAnswers: {}
};

const HISTORY_L4: LessonPack = {
  courseSlug: 'history',
  level: 4,
  weekIndex: 2,
  lesson: {
    level: 4,
    levelNameAr: 'حرب التحرير',
    levelDifficulty: 'hard',
    weekIndex: 2,
    titleAr: '8 ماي 1945 — الشرارة الكبرى',
    summaryAr: 'مظاهرات سطيف وقالمة وخراطة، والانتقال إلى الكفاح المسلّح.',
    illustrationKey: 'massacre_1945',
    expectedReadMs: 18_000,
    xpReward: 80,
    hintsAr: [
      'المدن الثلاث: سطيف، قالمة، خراطة.',
      'بوزيد سعّال أوّل من رفع العلم الجزائريّ.',
      'حوالي 45,000 شهيد حسب التقديرات الجزائرية.',
      'الأحداث مهّدت لثورة أوّل نوفمبر 1954.'
    ],
    contentBlocks: blocks([
      {
        type: 'paragraph',
        textAr:
          'يوم 8 ماي 1945، خرج آلاف الجزائريّين في مظاهرات سلميّة في سطيف وقالمة وخراطة، يرفعون اللافتات ويطالبون بالحرية. شارك أكثر من 130,000 جزائريّ في الحرب العالمية الثانية إلى جانب الحلفاء، أملاً في الاستقلال بعد النصر.'
      },
      {
        type: 'callout',
        textAr:
          'الشاب بوزيد سعّال حمل العلم الجزائريّ لأوّل مرّة، فاستشهد على يد شرطيّ فرنسيّ — لتشتعل الشّعلة التي لم تنطفئ.',
        accent: 'red'
      },
      {
        type: 'paragraph',
        textAr:
          'ردّت الإدارة الاستعمارية بمذابح وحشية: قصف جوّيّ، إعدامات جماعية، ومحارق. التقديرات الجزائرية تتحدّث عن 45,000 شهيد. كانت أحداث 8 ماي الشرارة التي أيقظت الوعي الوطنيّ، وقادت مباشرة إلى ثورة أوّل نوفمبر 1954.'
      },
      {
        type: 'quote',
        textAr:
          '"من حقّ الجزائريّ أن يحلم بحرّيته في اليوم الذي يحتفل فيه العالم بالحرّية." — شعار المظاهرات.'
      }
    ])
  },
  games: [
    MAKE_FLASHCARDS(
      [
        { id: 1, frontAr: '8 ماي 1945', backAr: 'يوم النصر العالميّ — ويوم خروج الجزائريّين للمطالبة بالحرية.' },
        { id: 2, frontAr: 'بوزيد سعّال', backAr: 'أوّل شهيد رفع العلم الجزائريّ.' },
        { id: 3, frontAr: 'سطيف وقالمة وخراطة', backAr: 'المدن الثلاث الكبرى التي شهدت المظاهرات.' },
        { id: 4, frontAr: '130,000', backAr: 'عدد الجزائريّين المشاركين في الحرب العالمية الثانية.' },
        { id: 5, frontAr: '45,000', backAr: 'العدد التقريبيّ لشهداء مجازر 8 ماي.' },
        { id: 6, frontAr: 'فرحات عبّاس', backAr: 'قائد حركة "أحباب البيان والحرية".' },
        { id: 7, frontAr: 'مصالي الحاج', backAr: 'زعيم حزب الشعب الجزائريّ.' },
        { id: 8, frontAr: '1 نوفمبر 1954', backAr: 'انطلاق الثورة المسلّحة.' },
        { id: 9, frontAr: 'جبهة التحرير الوطنيّ', backAr: 'القوّة المنظِّمة للثورة.' },
        { id: 10, frontAr: '5 جويلية 1962', backAr: 'تاريخ إعلان الاستقلال.' }
      ],
      { instructionAr: 'بطاقات 8 ماي والثورة — قيّم نفسك بعد كلّ بطاقة.', xpReward: 10 }
    ),
    MAKE_QUIZ(
      [
        {
          questionAr: 'في أيّ سنة وقعت مجازر سطيف وقالمة وخراطة؟',
          optionsAr: ['1942', '1945', '1954', '1962'],
          correctIndex: 1,
          explanationAr: 'في 8 ماي 1945، يوم الانتصار العالميّ على النازية.',
          difficulty: 'easy'
        },
        {
          questionAr: 'من هو أوّل شهيد رفع العلم الجزائريّ؟',
          optionsAr: ['ديدوش مراد', 'بوزيد سعّال', 'العربيّ بن مهيدي', 'كريم بلقاسم'],
          correctIndex: 1,
          explanationAr: 'بوزيد سعّال — استشهد في سطيف 8 ماي 1945.',
          difficulty: 'easy'
        },
        {
          questionAr: 'ما هي الحركة التي قادها فرحات عبّاس؟',
          optionsAr: ['حزب الشعب', 'أحباب البيان والحرية', 'جبهة التحرير', 'النجم الشمال إفريقيّ'],
          correctIndex: 1,
          explanationAr: 'طالبت بدولة جزائرية فدرالية مع فرنسا.',
          difficulty: 'medium'
        },
        {
          questionAr: 'ما العدد التقريبيّ لشهداء 8 ماي 1945 جزائرياً؟',
          optionsAr: ['1500', '15,000', '45,000', '100,000'],
          correctIndex: 2,
          explanationAr: 'التقدير الجزائريّ المعتمد هو 45,000 شهيد.',
          difficulty: 'medium'
        },
        {
          questionAr: 'متى انطلقت الثورة الجزائرية؟',
          optionsAr: ['1 نوفمبر 1954', '8 ماي 1945', '5 جويلية 1962', '14 جوان 1830'],
          correctIndex: 0,
          explanationAr: 'الثورة المباركة انطلقت ليلة 1 نوفمبر 1954.',
          difficulty: 'medium'
        }
      ],
      { instructionAr: 'سباق الزمن — اختبار 8 ماي والثورة.', xpReward: 18, timePerQuestion: 22 }
    ),
    {
      gameType: 'arrowmatch' as const,
      order: 0,
      instructionAr: 'صِل كلّ شخصيّة بدورها.',
      xpReward: 14,
      heartPenalty: 1,
      payload: {
        leftAr: [
          { id: 'A', label: 'فرحات عبّاس' },
          { id: 'B', label: 'مصالي الحاج' },
          { id: 'C', label: 'بوزيد سعّال' },
          { id: 'D', label: 'العربيّ بن مهيدي' }
        ],
        rightAr: [
          { id: '1', label: 'قائد "أحباب البيان والحرية"' },
          { id: '2', label: 'زعيم حزب الشعب' },
          { id: '3', label: 'أوّل شهيد رفع العلم' },
          { id: '4', label: 'مفجّر الثورة في وهران' }
        ]
      }
    },
    MAKE_TANK_ATTACK(
      [
        {
          questionAr: 'متى انطلقت الثورة الجزائريّة؟',
          correctAr: '1954',
          wrongAr: ['1945', '1962', '1830', '1939', '1958']
        },
        {
          questionAr: 'متى استقلّت الجزائر؟',
          correctAr: '1962',
          wrongAr: ['1958', '1956', '1954', '1965', '1945']
        },
        {
          questionAr: 'في أيّ سنة وقعت مذابح 8 ماي؟',
          correctAr: '1945',
          wrongAr: ['1942', '1939', '1954', '1830', '1962']
        },
        {
          questionAr: 'احتلّت فرنسا الجزائر سنة...',
          correctAr: '1830',
          wrongAr: ['1848', '1870', '1900', '1816', '1789']
        },
        {
          questionAr: 'أوّل شهيد رفع العلم الجزائريّ؟',
          correctAr: 'بوزيد سعّال',
          wrongAr: ['ديدوش مراد', 'العربيّ بن مهيدي', 'كريم بلقاسم', 'مصطفى بن بولعيد']
        },
        {
          questionAr: 'ماسينيسا ملك على...',
          correctAr: 'نوميديا',
          wrongAr: ['قرطاج', 'مصر', 'روما', 'فينيقيا', 'موريتانيا']
        },
        {
          questionAr: 'قائد المقاومة ضدّ الفرنسيّين 1832-1847؟',
          correctAr: 'الأمير عبد القادر',
          wrongAr: ['أحمد باي', 'الحاج المختار', 'لالّا فاطمة نسومر', 'بوعمامة']
        },
        {
          questionAr: 'مفجّر ثورة نوفمبر في الأوراس؟',
          correctAr: 'مصطفى بن بولعيد',
          wrongAr: ['كريم بلقاسم', 'العربيّ بن مهيدي', 'حسيبة بن بوعلي', 'مراد ديدوش']
        },
        {
          questionAr: 'تاريخ إعلان الاستقلال الرسميّ؟',
          correctAr: '5 جويلية 1962',
          wrongAr: ['18 مارس 1962', '1 نوفمبر 1954', '8 ماي 1945', '20 أوت 1955']
        },
        {
          questionAr: 'عاصمة الجزائر العثمانيّة؟',
          correctAr: 'الجزائر',
          wrongAr: ['تلمسان', 'قسنطينة', 'وهران', 'بجاية', 'عنابة']
        },
        {
          questionAr: 'اتّفاقيّات وقف إطلاق النار؟',
          correctAr: 'إيفيان',
          wrongAr: ['الجزائر', 'باريس', 'وهران', 'جنيف', 'لوزان']
        },
        {
          questionAr: 'مؤتمر إعادة هيكلة الثورة 1956؟',
          correctAr: 'الصومام',
          wrongAr: ['طرابلس', 'تونس', 'القاهرة', 'إيفيان', 'وهران']
        }
      ],
      {
        instructionAr: 'معركة الدبّابات — اختبر معلوماتك التاريخيّة!',
        xpReward: 35,
        waves: 5
      }
    )
  ],
  correctAnswers: {}
};

// ─── MATH ─────────────────────────────────────────────────────────────────────

const MATH_L1: LessonPack = {
  courseSlug: 'math',
  level: 1,
  weekIndex: 1,
  lesson: {
    level: 1,
    levelNameAr: 'أساسيات الأعداد',
    levelDifficulty: 'easy',
    weekIndex: 1,
    titleAr: 'القيمة المنزلية والعمليات',
    summaryAr: 'الأرقام، الجمع والطرح، أسرار العدد.',
    expectedReadMs: 12_000,
    xpReward: 40,
    hintsAr: ['الجمع تبادليّ: a+b = b+a', 'الضرب جمع متكرّر.'],
    contentBlocks: blocks([
      {
        type: 'paragraph',
        textAr:
          'الأعداد الطبيعية هي 0, 1, 2, 3, … ولكلّ رقم في العدد قيمة منزلية: الآحاد، العشرات، المئات. مثلاً في 347 الرّقم 4 يمثّل أربع عشرات.'
      },
      {
        type: 'callout',
        textAr: 'فكرة: الضرب هو جمع متكرّر — 4×5 يعني 5+5+5+5.',
        accent: 'cyan'
      }
    ])
  },
  games: [
    MAKE_FLASHCARDS(
      [
        { id: 1, frontAr: 'في 347 ما قيمة الرقم 4؟', backAr: '40 (منزلة العشرات)' },
        { id: 2, frontAr: '500 + 30 + 8 =', backAr: '538' },
        { id: 3, frontAr: '10 عشرات تساوي', backAr: '100' },
        { id: 4, frontAr: 'أيّهما أكبر: 456 أم 465؟', backAr: '465' },
        { id: 5, frontAr: '7 + 5 =', backAr: '12' },
        { id: 6, frontAr: '14 - 8 =', backAr: '6' },
        { id: 7, frontAr: '23 + 17 =', backAr: '40' }
      ],
      { instructionAr: 'بطاقات القيمة المنزلية والجمع.', xpReward: 6 }
    ),
    MAKE_QUIZ(
      [
        {
          questionAr: 'كم يساوي 7 × 8؟',
          optionsAr: ['54', '56', '64', '49'],
          correctIndex: 1,
          explanationAr: '7×8 = 56. جدول الضرب أساس كلّ شيء.',
          difficulty: 'easy'
        },
        {
          questionAr: 'كم يساوي 23 + 17؟',
          optionsAr: ['30', '40', '41', '37'],
          correctIndex: 1,
          explanationAr: '23 + 17 = 40 (3+7=10، اكتب 0 واحمل 1).',
          difficulty: 'easy'
        },
        {
          questionAr: 'في 612 ما القيمة المنزلية للرّقم 6؟',
          optionsAr: ['6 آحاد', '6 عشرات', '6 مئات', '6 آلاف'],
          correctIndex: 2,
          explanationAr: '6 في خانة المئات → 600.',
          difficulty: 'easy'
        },
        {
          questionAr: '100 - 35 =',
          optionsAr: ['55', '65', '75', '85'],
          correctIndex: 1,
          explanationAr: '100 - 35 = 65.',
          difficulty: 'easy'
        }
      ],
      { instructionAr: 'سباق الحساب الذهنيّ.', xpReward: 12, timePerQuestion: 18 }
    )
  ],
  correctAnswers: {}
};

const MATH_L2: LessonPack = {
  courseSlug: 'math',
  level: 2,
  weekIndex: 1,
  lesson: {
    level: 2,
    levelNameAr: 'الكسور والعمليّات',
    levelDifficulty: 'medium',
    weekIndex: 1,
    titleAr: 'إتقان جدول الضرب والكسور',
    summaryAr: 'جدول الضرب 1-12، الكسور البسيطة، الترتيب.',
    expectedReadMs: 12_000,
    xpReward: 50,
    hintsAr: ['1/2 = 2/4 = 4/8 (كسور متكافئة).'],
    contentBlocks: blocks([
      {
        type: 'paragraph',
        textAr:
          'الكسر يمثّل جزءاً من كلّ. 1/2 يعني جزء من اثنين متساويين. الكسران 1/2 و 2/4 متكافئان (يمثّلان نفس القيمة).'
      },
      {
        type: 'callout',
        textAr: 'لمقارنة كسور لها نفس المقام، انظر إلى البسط فقط: 3/5 > 2/5.',
        accent: 'cyan'
      }
    ])
  },
  games: [
    MAKE_FLASHCARDS(
      [
        { id: 1, frontAr: '7 × 8', backAr: '56' },
        { id: 2, frontAr: '9 × 6', backAr: '54' },
        { id: 3, frontAr: '12 × 4', backAr: '48' },
        { id: 4, frontAr: '1/2 = ?/4', backAr: '2' },
        { id: 5, frontAr: '1/4 + 1/4', backAr: '1/2' },
        { id: 6, frontAr: 'أيّهما أكبر 1/3 أم 1/2؟', backAr: '1/2' },
        { id: 7, frontAr: '3/3 يساوي', backAr: '1' }
      ],
      { instructionAr: 'بطاقات الضرب والكسور.', xpReward: 6 }
    ),
    MAKE_QUIZ(
      [
        {
          questionAr: 'كم يساوي 1/4 + 1/4؟',
          optionsAr: ['1/8', '2/8', '1/2', '2/4 و 1/2 معاً'],
          correctIndex: 3,
          explanationAr: '1/4 + 1/4 = 2/4 = 1/2 (كسر متكافئ).',
          difficulty: 'medium'
        },
        {
          questionAr: '12 × 11 =',
          optionsAr: ['121', '122', '132', '144'],
          correctIndex: 2,
          explanationAr: '12×11 = 132.',
          difficulty: 'medium'
        },
        {
          questionAr: 'إذا اشتريت 3 دفاتر بـ 50 دج للواحد، كم الثمن؟',
          optionsAr: ['100 دج', '150 دج', '200 دج', '50 دج'],
          correctIndex: 1,
          explanationAr: '3 × 50 = 150 دج.',
          difficulty: 'easy'
        }
      ],
      { instructionAr: 'سباق الضرب والكسور.', xpReward: 14, timePerQuestion: 20 }
    )
  ],
  correctAnswers: {}
};

const MATH_L3: LessonPack = {
  courseSlug: 'math',
  level: 3,
  weekIndex: 1,
  lesson: {
    level: 3,
    levelNameAr: 'الجبر',
    levelDifficulty: 'medium_hard',
    weekIndex: 1,
    titleAr: 'المعادلات الخطيّة والأسس',
    summaryAr: 'حلّ المعادلات بمتغيّر واحد، والأسس.',
    expectedReadMs: 14_000,
    xpReward: 60,
    hintsAr: ['x + 3 = 7 ⟹ اطرح 3 من الطرفين.', '2³ = 2×2×2 = 8'],
    contentBlocks: blocks([
      {
        type: 'paragraph',
        textAr:
          'المتغيّر مثل x يمثّل عدداً مجهولاً. لحلّ x + 3 = 8 نطرح 3 من الطرفين فنجد x = 5. كلّ معادلة لها "حلّ" يجعل الطرفين متساويين.'
      },
      {
        type: 'callout',
        textAr: 'الأسّ يكثّف الضرب: 2³ يعني 2×2×2 = 8.',
        accent: 'cyan'
      }
    ])
  },
  games: [
    MAKE_QUIZ(
      [
        {
          questionAr: 'إذا كان x + 3 = 8، فما قيمة x؟',
          optionsAr: ['3', '5', '8', '11'],
          correctIndex: 1,
          explanationAr: 'x = 8 - 3 = 5.',
          difficulty: 'medium'
        },
        {
          questionAr: 'إذا 2x = 10، فما قيمة x؟',
          optionsAr: ['2', '5', '8', '20'],
          correctIndex: 1,
          explanationAr: 'x = 10 ÷ 2 = 5.',
          difficulty: 'medium'
        },
        {
          questionAr: 'كم يساوي 2³؟',
          optionsAr: ['6', '8', '9', '23'],
          correctIndex: 1,
          explanationAr: '2³ = 2×2×2 = 8.',
          difficulty: 'medium'
        },
        {
          questionAr: 'حلّ 3x + 1 = 10، x = ؟',
          optionsAr: ['2', '3', '4', '9'],
          correctIndex: 1,
          explanationAr: '3x = 9 ⟹ x = 3.',
          difficulty: 'hard'
        }
      ],
      { instructionAr: 'سباق الجبر — حلّ المعادلات بسرعة.', xpReward: 16, timePerQuestion: 24 }
    ),
    MAKE_FLASHCARDS(
      [
        { id: 1, frontAr: 'الأسّ', backAr: 'تكرار الضرب: aⁿ' },
        { id: 2, frontAr: '10²', backAr: '100' },
        { id: 3, frontAr: '5000 بصيغة علميّة', backAr: '5 × 10³' },
        { id: 4, frontAr: 'العنصر المحايد للجمع', backAr: '0' },
        { id: 5, frontAr: 'العنصر المحايد للضرب', backAr: '1' }
      ],
      { instructionAr: 'بطاقات الجبر والأسس.', xpReward: 6 }
    )
  ],
  correctAnswers: {}
};

const MATH_L4: LessonPack = {
  courseSlug: 'math',
  level: 4,
  weekIndex: 2,
  lesson: {
    level: 4,
    levelNameAr: 'حساب المثلثات',
    levelDifficulty: 'hard',
    weekIndex: 2,
    titleAr: 'فيثاغورس وحساب المثلّثات',
    summaryAr: 'المثلّث القائم، نظرية فيثاغورس، sin/cos/tan.',
    expectedReadMs: 16_000,
    xpReward: 70,
    hintsAr: ['SOH-CAH-TOA = sin/cos/tan', 'a² + b² = c² في المثلّث القائم.'],
    contentBlocks: blocks([
      {
        type: 'paragraph',
        textAr:
          'في كلّ مثلّث قائم، مربّع طول الوتر يساوي مجموع مربّعَي الضّلعين الآخرين: a² + b² = c² (نظرية فيثاغورس).'
      },
      {
        type: 'callout',
        textAr:
          'الدّوال المثلّثية: sin = المقابل/الوتر، cos = المجاور/الوتر، tan = المقابل/المجاور.',
        accent: 'cyan'
      }
    ])
  },
  games: [
    MAKE_FLASHCARDS(
      [
        { id: 1, frontAr: 'صيغة فيثاغورس', backAr: 'a² + b² = c²' },
        { id: 2, frontAr: 'إذا a=3 وb=4 فما c؟', backAr: '5' },
        { id: 3, frontAr: 'sin(θ)', backAr: 'المقابل / الوتر' },
        { id: 4, frontAr: 'cos(θ)', backAr: 'المجاور / الوتر' },
        { id: 5, frontAr: 'tan(θ)', backAr: 'المقابل / المجاور' },
        { id: 6, frontAr: 'sin(90°)', backAr: '1' },
        { id: 7, frontAr: 'cos(0°)', backAr: '1' }
      ],
      { instructionAr: 'بطاقات حساب المثلّثات.', xpReward: 8 }
    ),
    MAKE_QUIZ(
      [
        {
          questionAr: 'في مثلّث قائم a=3 وb=4، ما طول الوتر c؟',
          optionsAr: ['5', '6', '7', '12'],
          correctIndex: 0,
          explanationAr: 'c² = 9 + 16 = 25 ⟹ c = 5.',
          difficulty: 'medium'
        },
        {
          questionAr: 'كم تساوي sin(90°)؟',
          optionsAr: ['0', '0.5', '1', '∞'],
          correctIndex: 2,
          explanationAr: 'sin(90°) = 1.',
          difficulty: 'medium'
        },
        {
          questionAr: 'ما هي الصيغة المثلّثية لـ tan؟',
          optionsAr: ['المقابل/الوتر', 'المجاور/الوتر', 'المقابل/المجاور', 'الوتر/المقابل'],
          correctIndex: 2,
          explanationAr: 'tan = المقابل / المجاور (TOA).',
          difficulty: 'medium'
        }
      ],
      { instructionAr: 'سباق الزمن — حساب المثلّثات.', xpReward: 18, timePerQuestion: 22 }
    ),
    MAKE_TANK_ATTACK(
      [
        { questionAr: '٧ × ٨ = ؟', correctAr: '56', wrongAr: ['54', '58', '48', '64', '49'] },
        { questionAr: '٩ × ٩ = ؟', correctAr: '81', wrongAr: ['72', '99', '64', '91', '88'] },
        { questionAr: '١٢ × ١٢ = ؟', correctAr: '144', wrongAr: ['132', '124', '156', '120', '148'] },
        { questionAr: '١٤٤ ÷ ١٢ = ؟', correctAr: '12', wrongAr: ['14', '16', '11', '13', '10'] },
        { questionAr: '٢٥% من ٢٠٠ = ؟', correctAr: '50', wrongAr: ['25', '40', '60', '75', '20'] },
        { questionAr: '√١٦٩ = ؟', correctAr: '13', wrongAr: ['14', '11', '16', '12', '15'] },
        { questionAr: '√٢٢٥ = ؟', correctAr: '15', wrongAr: ['12', '14', '16', '13', '25'] },
        { questionAr: 'مجموع زوايا المثلّث؟', correctAr: '180°', wrongAr: ['90°', '360°', '270°', '120°'] },
        { questionAr: 'في مثلّث قائم a=٦ b=٨، الوتر c =؟', correctAr: '10', wrongAr: ['12', '14', '7', '9', '11'] },
        { questionAr: 'sin(٩٠°) = ؟', correctAr: '1', wrongAr: ['0', '0.5', '∞', '−1', '0.7'] },
        { questionAr: 'cos(٠°) = ؟', correctAr: '1', wrongAr: ['0', '0.5', '−1', '∞', '0.7'] },
        {
          questionAr: 'صيغة فيثاغورس؟',
          correctAr: 'a² + b² = c²',
          wrongAr: ['a + b = c', 'a × b = c', 'a² − b² = c²', 'a + b² = c']
        },
        { questionAr: 'مساحة مربّع طول ضلعه ٧؟', correctAr: '49', wrongAr: ['28', '14', '64', '42', '36'] },
        { questionAr: 'محيط دائرة (π=٣.١٤، r=١٠)؟', correctAr: '62.8', wrongAr: ['31.4', '100', '50', '78.5', '20'] },
        { questionAr: 'أصغر عدد أوّليّ؟', correctAr: '2', wrongAr: ['1', '3', '0', '5', '7'] },
        {
          questionAr: 'الكسر ١/٢ + ١/٤ = ؟',
          correctAr: '3/4',
          wrongAr: ['1/4', '2/4', '1/2', '5/4', '2/6']
        }
      ],
      {
        instructionAr: 'معركة الدبّابات — اضرب الأرقام الصحيحة!',
        xpReward: 35,
        waves: 5
      }
    )
  ],
  correctAnswers: {}
};

// ─── CODING ───────────────────────────────────────────────────────────────────

const CODING_L1: LessonPack = {
  courseSlug: 'coding',
  level: 1,
  weekIndex: 1,
  lesson: {
    level: 1,
    levelNameAr: 'أساسيات البرمجة',
    levelDifficulty: 'easy',
    weekIndex: 1,
    titleAr: 'الكتل (Blocks) والأسبرايتس',
    summaryAr: 'تعرّف على Scratch / PictoBlox، واصنع شخصيتك تتحرّك.',
    expectedReadMs: 12_000,
    xpReward: 45,
    hintsAr: ['الـ Sprite شخصيّة على المسرح.', 'الكتل تترابط مثل قطع الليغو.'],
    contentBlocks: blocks([
      {
        type: 'paragraph',
        textAr:
          'في Scratch وPictoBlox، الـ "Sprite" شخصية على المسرح. تربط كتلاً (Blocks) ليفعل أشياء: الحركة، الكلام، تغيير اللون، الصوت.'
      },
      {
        type: 'callout',
        textAr:
          'تجربتك الأولى: اضف كتلة "عند ضغط العلم الأخضر"، ثمّ "تحرّك 10 خطوات"، ثمّ "إذا لمست الحافّة ارتدّ".',
        accent: 'emerald'
      }
    ])
  },
  games: [
    MAKE_FLASHCARDS(
      [
        { id: 1, frontAr: 'كتل الحركة', backAr: 'تحريك، دوران، ذهاب لموقع.' },
        { id: 2, frontAr: 'كتل المظهر', backAr: 'تغيير لون، حجم، زيّ.' },
        { id: 3, frontAr: 'كتل الصوت', backAr: 'تشغيل صوت، تغيير حجمه.' },
        { id: 4, frontAr: 'كتل الأحداث', backAr: 'عند الضّغط، عند مفتاح، عند علم أخضر.' },
        { id: 5, frontAr: 'كتل التحكّم', backAr: 'إذا/ثمّ، حلقات تكرار، انتظار.' },
        { id: 6, frontAr: 'كتل الاستشعار', backAr: 'هل تلمس؟ هل ضُغط مفتاح؟' },
        { id: 7, frontAr: 'كتل العمليّات', backAr: 'حساب، مقارنات، منطق.' },
        { id: 8, frontAr: 'كتل المتغيّرات', backAr: 'تخزين قيم تتغيّر.' }
      ],
      { instructionAr: 'بطاقات تصنيف الكتل في Scratch.', xpReward: 6 }
    ),
    MAKE_QUIZ(
      [
        {
          questionAr: 'ما هو الـ Sprite؟',
          optionsAr: ['كتلة برمجية', 'شخصيّة على المسرح', 'لون', 'مكتبة'],
          correctIndex: 1,
          explanationAr: 'الـ Sprite شخصية أو كائن على مسرح Scratch.',
          difficulty: 'easy'
        },
        {
          questionAr: 'أيّ كتلة تشغّل البرنامج؟',
          optionsAr: ['عند العلم الأخضر', 'تحرّك', 'قل', 'فكّر'],
          correctIndex: 0,
          explanationAr: 'كتلة "عند العلم الأخضر" هي البداية النموذجية.',
          difficulty: 'easy'
        },
        {
          questionAr: 'حلقة "إلى الأبد" تعمل…',
          optionsAr: ['مرّة واحدة', 'إلى ما لا نهاية', 'حتى تضغط الإيقاف', '5 مرات'],
          correctIndex: 1,
          explanationAr: 'تكرّر دون توقّف حتى يوقفها المستخدم.',
          difficulty: 'easy'
        }
      ],
      { instructionAr: 'سباق أساسيات Scratch.', xpReward: 12, timePerQuestion: 18 }
    )
  ],
  correctAnswers: {}
};

const CODING_L2: LessonPack = {
  courseSlug: 'coding',
  level: 2,
  weekIndex: 1,
  lesson: {
    level: 2,
    levelNameAr: 'منطق متقدّم',
    levelDifficulty: 'medium',
    weekIndex: 1,
    titleAr: 'الشّروط، الدّوال، والقوائم',
    summaryAr: 'إذا/وإلّا، الكتل المخصّصة، اللوائح.',
    expectedReadMs: 13_000,
    xpReward: 55,
    hintsAr: ['الكتلة المخصّصة تجمع كتلاً متكرّرة.', 'القائمة تخزّن عدّة قيم.'],
    contentBlocks: blocks([
      {
        type: 'paragraph',
        textAr:
          'الشّرط (if) يفصل بين حالتين. with AND/OR/NOT، تستطيع بناء قرارات معقّدة. الدّالة (الكتلة المخصّصة) تجمع تعليمات تعيدها متى احتجت.'
      },
      {
        type: 'callout',
        textAr:
          'مثال: لو لمست العدوّ AND صحّتك أكبر من 0 → اخسر صحّة. else → نهاية اللعبة.',
        accent: 'emerald'
      }
    ])
  },
  games: [
    MAKE_QUIZ(
      [
        {
          questionAr: 'ما فائدة الكتلة المخصّصة (الدّالة)؟',
          optionsAr: ['تشغيل اللعبة', 'تكرار كود قابل للاستدعاء', 'إضافة لون', 'تشغيل صوت'],
          correctIndex: 1,
          explanationAr: 'تجمع تعليمات لتعيد استخدامها بسطر واحد.',
          difficulty: 'medium'
        },
        {
          questionAr: 'ماذا تستعمل لتخزين قائمة نقاط أعلى؟',
          optionsAr: ['متغيّر', 'قائمة (List)', 'لون', 'مفتاح'],
          correctIndex: 1,
          explanationAr: 'القائمة تخزّن عدّة قيم.',
          difficulty: 'medium'
        },
        {
          questionAr: 'ماذا يعني "broadcast"؟',
          optionsAr: ['طباعة', 'بثّ رسالة بين الأسبرايتس', 'حذف كائن', 'تشغيل موسيقى'],
          correctIndex: 1,
          explanationAr: 'broadcast يبثّ رسالة لتنسيق المشاهد.',
          difficulty: 'medium'
        }
      ],
      { instructionAr: 'سباق المنطق المتقدّم.', xpReward: 14, timePerQuestion: 22 }
    )
  ],
  correctAnswers: {}
};

const CODING_L3: LessonPack = {
  courseSlug: 'coding',
  level: 3,
  weekIndex: 1,
  lesson: {
    level: 3,
    levelNameAr: 'تطوير الألعاب',
    levelDifficulty: 'medium_hard',
    weekIndex: 1,
    titleAr: 'فيزياء وذكاء اصطناعيّ بسيط',
    summaryAr: 'الجاذبية، السرعة، سلوك العدوّ.',
    expectedReadMs: 15_000,
    xpReward: 65,
    hintsAr: ['velocity_y تزيد كلّ إطار → جاذبية.', 'إذا كان اللاعب قريباً → طارد.'],
    contentBlocks: blocks([
      {
        type: 'paragraph',
        textAr:
          'لتقليد الجاذبية: لكلّ إطار، أضف قيمة ثابتة لـ velocity_y، ثمّ غيّر y بمقدار velocity_y. عند ملامسة الأرض، صفّر velocity_y.'
      },
      {
        type: 'callout',
        textAr:
          'ذكاء عدوّ بسيط: 1) دوريّة (يمين/يسار)، 2) إذا اقترب اللاعب → طارده، 3) إذا ابتعد → عُد للدوريّة.',
        accent: 'emerald'
      }
    ])
  },
  games: [
    MAKE_QUIZ(
      [
        {
          questionAr: 'كيف نقلّد الجاذبية في Scratch؟',
          optionsAr: ['تحريك ثابت', 'زيادة velocity_y كلّ إطار', 'تكرار 10 مرات', 'لا يمكن'],
          correctIndex: 1,
          explanationAr: 'velocity_y تتراكم → سقوط متسارع.',
          difficulty: 'hard'
        },
        {
          questionAr: 'ما الخطوة الأولى لذكاء عدوّ ذكيّ؟',
          optionsAr: ['تشغيل صوت', 'دوريّة بين نقطتين', 'تغيير اللون', 'إنهاء اللعبة'],
          correctIndex: 1,
          explanationAr: 'الدوريّة سلوك أساسيّ قبل المطاردة.',
          difficulty: 'medium'
        }
      ],
      { instructionAr: 'سباق تطوير الألعاب.', xpReward: 16, timePerQuestion: 24 }
    )
  ],
  correctAnswers: {}
};

const CODING_L4: LessonPack = {
  courseSlug: 'coding',
  level: 4,
  weekIndex: 1,
  lesson: {
    level: 4,
    levelNameAr: 'احتراف',
    levelDifficulty: 'hard',
    weekIndex: 1,
    titleAr: 'هندسة المشاريع الكبيرة',
    summaryAr: 'البنية، الأداء، النشر.',
    expectedReadMs: 16_000,
    xpReward: 75,
    hintsAr: ['افصل المنطق عن العرض.', 'احذف الكتل المتكرّرة عبر الدّوال.'],
    contentBlocks: blocks([
      {
        type: 'paragraph',
        textAr:
          'في المشاريع الكبيرة، نقسم البرنامج إلى أنظمة: تحكّم اللاعب، ذكاء العدوّ، الاصطدام، النقاط. كلّ نظام كتلة مخصّصة، ممّا يسهّل الصيانة.'
      },
      {
        type: 'callout',
        textAr:
          'قاعدة الـ DRY (Don’t Repeat Yourself): لا تكتب نفس الكود مرّتين — حوّله إلى دالّة.',
        accent: 'emerald'
      }
    ])
  },
  games: [
    MAKE_QUIZ(
      [
        {
          questionAr: 'ما المقصود بـ DRY في البرمجة؟',
          optionsAr: ['اكتب كثيراً', 'لا تكرّر نفسك', 'احذف كلّ شيء', 'استخدم قواميس'],
          correctIndex: 1,
          explanationAr: 'Don\'t Repeat Yourself — أعد استخدام الكود.',
          difficulty: 'medium'
        },
        {
          questionAr: 'كيف نحسّن أداء لعبة Scratch بطيئة؟',
          optionsAr: ['زيادة الأسبرايتس', 'تقليل التكرارات في الإطار', 'إضافة أصوات', 'تكبير الشاشة'],
          correctIndex: 1,
          explanationAr: 'كلّ تكرار في الإطار يكلّف وقتاً — قلّلها.',
          difficulty: 'hard'
        }
      ],
      { instructionAr: 'سباق هندسة البرامج.', xpReward: 18, timePerQuestion: 26 }
    ),
    MAKE_TANK_ATTACK(
      [
        {
          questionAr: 'ماذا يعني DRY في البرمجة؟',
          correctAr: 'لا تكرّر نفسك',
          wrongAr: ['اكتب كثيراً', 'احذف الكود', 'استخدم قواميس', 'كرّر دائماً']
        },
        {
          questionAr: 'الأمر للتكرار في Python؟',
          correctAr: 'for',
          wrongAr: ['if', 'else', 'def', 'while', 'try']
        },
        {
          questionAr: 'الأمر للتحقّق من شرط؟',
          correctAr: 'if',
          wrongAr: ['for', 'while', 'def', 'return', 'class']
        },
        {
          questionAr: 'لتعريف دالّة في Python؟',
          correctAr: 'def',
          wrongAr: ['function', 'fun', 'method', 'fn', 'lambda']
        },
        {
          questionAr: 'نتيجة ٥ % ٢ في Python؟',
          correctAr: '1',
          wrongAr: ['0', '2', '2.5', '5', '3']
        },
        {
          questionAr: 'لون كتل الحركة في Scratch؟',
          correctAr: 'أزرق',
          wrongAr: ['أحمر', 'أخضر', 'أصفر', 'بنفسجيّ', 'برتقاليّ']
        },
        {
          questionAr: 'اختصار HTML؟',
          correctAr: 'لغة وصف النصوص',
          wrongAr: ['لغة برمجة', 'إطار عمل', 'قاعدة بيانات', 'متصفّح', 'نظام تشغيل']
        },
        {
          questionAr: 'دالّة الطباعة في Python؟',
          correctAr: 'print()',
          wrongAr: ['echo()', 'log()', 'show()', 'write()', 'console()']
        },
        {
          questionAr: 'نوع البيانات للحقيقة/الزيف؟',
          correctAr: 'bool',
          wrongAr: ['int', 'str', 'float', 'list', 'dict']
        },
        {
          questionAr: 'علامة المساواة المنطقيّة في Python؟',
          correctAr: '==',
          wrongAr: ['=', '!=', '===', '<=', '=>']
        },
        {
          questionAr: 'مصطلح للأخطاء البرمجيّة؟',
          correctAr: 'Bug',
          wrongAr: ['Fix', 'Crash', 'Error404', 'Loop', 'Patch']
        },
        {
          questionAr: 'لتكرار طالما الشرط صحيح؟',
          correctAr: 'while',
          wrongAr: ['for', 'if', 'do', 'loop', 'until']
        },
        {
          questionAr: 'كم عنصراً في [1,2,3,4,5]؟',
          correctAr: '5',
          wrongAr: ['4', '6', '3', '15', '0']
        },
        {
          questionAr: 'لغة برمجة الويب الأمامية؟',
          correctAr: 'JavaScript',
          wrongAr: ['Python', 'Java', 'C++', 'PHP', 'Ruby']
        },
        {
          questionAr: 'ما هي خانة الذاكرة المسمّاة؟',
          correctAr: 'متغيّر',
          wrongAr: ['دالّة', 'حلقة', 'شرط', 'كائن', 'وحدة']
        }
      ],
      {
        instructionAr: 'معركة الدبّابات — تحدّي البرمجة!',
        xpReward: 35,
        waves: 5
      }
    )
  ],
  correctAnswers: {}
};

export const LESSON_PACKS: LessonPack[] = [
  HISTORY_L1,
  HISTORY_L2,
  HISTORY_L3,
  HISTORY_L4,
  MATH_L1,
  MATH_L2,
  MATH_L3,
  MATH_L4,
  CODING_L1,
  CODING_L2,
  CODING_L3,
  CODING_L4
];
