module.exports = {
  courseSlug: 'coding',
  lessons: [
    {
      lesson: {
        titleAr: 'التفكير كالمبرمج',
        summaryAr: 'تعلّم تفكيك المشكلة، تتابع الخطوات، والشروط.',
        illustrationKey: 'thinking_like_coder',
        expectedReadMs: 25_000,
        xpReward: 40,
        hintsAr: [
          'الخوارزمية = سلسلة خطوات منظّمة تنتهي بنتيجة.',
          'الشرط (if) يفصل بين حالتين: عندما يتحقّق وعندما لا يتحقّق.'
        ],
        contentBlocks: [
          {
            type: 'paragraph',
            textAr:
              'البرمجة هي إعطاء تعليمات واضحة للحاسوب لحلّ مشكلة. التفكير المنطقي يبدأ بـ: تفكيك المشكلة، اختيار الترتيب، ثم اتخاذ قرار حسب الشروط.'
          },
          {
            type: 'callout',
            textAr: 'مثال على خوارزمية يومية: تحضير كأس شاي = (غلِ الماء، أضف الشاي، انتظر، اسكب).',
            accent: 'emerald'
          },
          {
            type: 'paragraph',
            textAr:
              'الشرط يساعد على اتخاذ القرار: "إذا كانت درجة الحرارة باردة، ألبس معطفاً، وإلّا اخرج بقميص خفيف". في البرمجة نكتب: if (cold) wear coat else wear shirt.'
          }
        ]
      },
      games: [
        {
          gameType: 'flashcard',
          instructionAr: 'راجع المفاهيم الأساسية.',
          xpReward: 5,
          payload: {
            cardsAr: [
              { id: 1, frontAr: 'خوارزمية', backAr: 'سلسلة خطوات منظّمة لحلّ مشكلة.' },
              { id: 2, frontAr: 'متغيّر', backAr: 'مكان لتخزين قيمة يمكن أن تتغيّر.' },
              { id: 3, frontAr: 'شرط (if)', backAr: 'تنفيذ تعليمات حسب صحّة جملة.' }
            ]
          }
        },
        {
          gameType: 'dragdrop',
          instructionAr: 'رتّب الخطوات لتشكيل خوارزمية صحيحة لتحضير شاي.',
          xpReward: 10,
          payload: {
            sourcesAr: [
              { id: 1, label: 'غلِ الماء' },
              { id: 2, label: 'أضف الشاي' },
              { id: 3, label: 'انتظر دقيقتين' },
              { id: 4, label: 'اسكب في الكأس' }
            ],
            targetsAr: [
              { id: 'A', label: 'الخطوة 1' },
              { id: 'B', label: 'الخطوة 2' },
              { id: 'C', label: 'الخطوة 3' },
              { id: 'D', label: 'الخطوة 4' }
            ]
          },
          correctAnswer: [
            [1, 'A'],
            [2, 'B'],
            [3, 'C'],
            [4, 'D']
          ]
        },
        {
          gameType: 'arrowmatch',
          instructionAr: 'صِل كل مفهوم برمزه.',
          xpReward: 10,
          payload: {
            leftAr: [
              { id: 'A', label: 'إذا (شرط)' },
              { id: 'B', label: 'تكرار' },
              { id: 'C', label: 'دالّة' }
            ],
            rightAr: [
              { id: '1', label: 'if' },
              { id: '2', label: 'for' },
              { id: '3', label: 'function' }
            ]
          },
          correctAnswer: [
            { from: 'A', to: '1' },
            { from: 'B', to: '2' },
            { from: 'C', to: '3' }
          ]
        }
      ]
    }
  ]
};
