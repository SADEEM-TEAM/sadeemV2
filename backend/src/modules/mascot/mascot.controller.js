const asyncHandler = require('../../utils/asyncHandler');
const Lesson = require('../../models/Lesson');

const SHARED = {
  welcome: ['أهلاً بك! متحمس جدّاً للتعلّم معك اليوم.', 'مرحبا! تجهّز لرحلة معرفية ممتعة.'],
  start_lesson: ['ركّز معي، الدرس قصير وممتع.', 'هيا نبدأ! اقرأ بهدوء وفكّر معي.'],
  encourage: ['لا بأس! المحاولة جزء من التعلّم. ركّز معي مرة أخرى.', 'أنت قريب من الإجابة، تنفّس وحاول مجدّداً.'],
  celebrate: ['أحسنت! إجابة ممتازة!', 'رائع! تستحق نجمة كبيرة.']
};

exports.react = asyncHandler(async (req, res) => {
  const { context, errorsCount = 0, lessonId } = req.body;
  let expression = 'neutral';
  let messageAr = SHARED.welcome[0];
  let hintAr = null;

  if (context === 'lesson_start') {
    expression = 'teaching';
    messageAr = SHARED.start_lesson[Math.floor(Math.random() * SHARED.start_lesson.length)];
  } else if (context === 'errors_three' && errorsCount >= 3) {
    expression = 'teaching';
    messageAr = SHARED.encourage[Math.floor(Math.random() * SHARED.encourage.length)];
    if (lessonId) {
      const lesson = await Lesson.findById(lessonId).select('hintsAr').lean();
      if (lesson?.hintsAr?.length) {
        hintAr = lesson.hintsAr[Math.floor(Math.random() * lesson.hintsAr.length)];
      }
    }
  } else if (context === 'celebrate') {
    expression = 'welcoming';
    messageAr = SHARED.celebrate[Math.floor(Math.random() * SHARED.celebrate.length)];
  } else if (context === 'dashboard_first_visit') {
    expression = 'welcoming';
    messageAr = SHARED.welcome[Math.floor(Math.random() * SHARED.welcome.length)];
  }

  res.json({
    ok: true,
    data: {
      mascot: req.user.mascotPref || 'blue',
      expression,
      messageAr,
      hintAr
    }
  });
});
