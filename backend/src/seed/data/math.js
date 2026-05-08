module.exports = {
  courseSlug: 'math',
  lessons: [
    {
      lesson: {
        titleAr: 'الأعداد والعمليات',
        summaryAr: 'فهم الأعداد الطبيعية وأهمّ خصائص الجمع والضرب.',
        illustrationKey: 'numbers_intro',
        expectedReadMs: 25_000,
        xpReward: 40,
        hintsAr: [
          'تذكّر: الجمع تبادلي (a + b = b + a).',
          'في الضرب، صفر مضروب في أيّ عدد يساوي صفراً.'
        ],
        contentBlocks: [
          {
            type: 'paragraph',
            textAr:
              'الأعداد الطبيعية هي 0, 1, 2, 3, ... ونستعملها للعدّ. عمليتا الجمع والضرب لهما خصائص ممتازة: التبادلية والترابطية. مثلاً 3 + 4 = 4 + 3.'
          },
          {
            type: 'example',
            textAr: 'مثال: إذا اشتريت 3 دفاتر بـ 50 دج للواحد، فالثمن الإجمالي هو 3 × 50 = 150 دج.'
          },
          {
            type: 'callout',
            textAr: 'فكرة: الضرب هو جمع متكرّر — 4 × 5 يعني 5 + 5 + 5 + 5.',
            accent: 'cyan'
          }
        ]
      },
      games: [
        {
          gameType: 'quiz',
          instructionAr: 'اختر الإجابة الصحيحة.',
          xpReward: 8,
          payload: {
            questionAr: 'كم يساوي 7 × 8؟',
            optionsAr: ['54', '56', '58', '64']
          },
          correctAnswer: 1
        },
        {
          gameType: 'flashcard',
          instructionAr: 'راجع الخصائص بالبطاقات.',
          xpReward: 5,
          payload: {
            cardsAr: [
              { id: 1, frontAr: 'تبادلية الجمع', backAr: 'a + b = b + a' },
              { id: 2, frontAr: 'تبادلية الضرب', backAr: 'a × b = b × a' },
              { id: 3, frontAr: 'العنصر المحايد للجمع', backAr: 'a + 0 = a' }
            ]
          }
        },
        {
          gameType: 'dragdrop',
          instructionAr: 'اسحب كل عملية إلى نتيجتها.',
          xpReward: 10,
          payload: {
            sourcesAr: [
              { id: 1, label: '12 + 7' },
              { id: 2, label: '6 × 9' },
              { id: 3, label: '100 - 36' }
            ],
            targetsAr: [
              { id: 'A', label: '19' },
              { id: 'B', label: '54' },
              { id: 'C', label: '64' }
            ]
          },
          correctAnswer: [
            [1, 'A'],
            [2, 'B'],
            [3, 'C']
          ]
        },
        {
          gameType: 'tankattack',
          instructionAr: 'هاجم بمعرفتك! اكتب الإجابة العددية الصحيحة لإطلاق المقذوف.',
          xpReward: 14,
          heartPenalty: 0,
          payload: {
            theme: 'math',
            durationMs: 60_000,
            wavesAr: [
              { questionAr: '12 + 9 =', answerAr: '21' },
              { questionAr: '7 × 6 =', answerAr: '42' },
              { questionAr: '100 - 47 =', answerAr: '53' },
              { questionAr: '64 ÷ 8 =', answerAr: '8' },
              { questionAr: '15 × 4 =', answerAr: '60' }
            ]
          }
        }
      ]
    }
  ]
};
