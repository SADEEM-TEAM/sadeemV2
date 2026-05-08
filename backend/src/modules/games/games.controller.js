const asyncHandler = require('../../utils/asyncHandler');
const { notFound, forbidden } = require('../../utils/httpError');
const MiniGame = require('../../models/MiniGame');
const Lesson = require('../../models/Lesson');
const Progress = require('../../models/Progress');
const User = require('../../models/User');
const { check } = require('../../games-engine');
const { regenerateHearts, MAX_HEARTS } = require('../../services/hearts.service');
const { applyXp } = require('../../services/xp.service');

exports.listForLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.lessonId);
  if (!lesson) throw notFound('Lesson');

  const progress = await Progress.findOne({
    userId: req.user.id,
    lessonId: lesson._id
  });
  if (!progress?.readReceiptIssuedAt) {
    throw forbidden('Lesson must be read before games unlock');
  }

  const games = await MiniGame.find({ lessonId: lesson._id })
    .sort({ order: 1 })
    .select('-correctAnswer')
    .lean();

  res.json({ ok: true, data: games });
});

exports.submit = asyncHandler(async (req, res) => {
  const game = await MiniGame.findById(req.params.gameId).select('+correctAnswer');
  if (!game) throw notFound('Game');

  const { answer, lang = 'ar' } = req.body;
  const result = check(game.gameType, game.payload, game.correctAnswer, answer, lang);

  const user = await User.findById(req.user.id);
  await regenerateHearts(user);

  let progress = await Progress.findOne({ userId: user._id, lessonId: game.lessonId });
  if (!progress) {
    progress = await Progress.create({
      userId: user._id,
      courseId: (await Lesson.findById(game.lessonId).select('courseId').lean()).courseId,
      lessonId: game.lessonId,
      status: 'in_progress'
    });
  }

  let xpEarned = 0;
  let heartsLost = 0;
  if (result.correct) {
    xpEarned = game.xpReward;
    await applyXp(user, xpEarned);
  } else {
    heartsLost = game.heartPenalty;
    user.hearts = Math.max(0, user.hearts - heartsLost);
    user.lastHeartLossAt = new Date();
    const key = String(game._id);
    progress.errorsByGame.set(key, (progress.errorsByGame.get(key) || 0) + 1);
    await user.save();
    await progress.save();
  }

  res.json({
    ok: true,
    data: {
      correct: result.correct,
      gameType: game.gameType,
      xpEarned,
      heartsLost,
      hearts: user.hearts,
      maxHearts: MAX_HEARTS,
      xp: user.xp,
      errors: progress.errorsByGame.get(String(game._id)) || 0
    }
  });
});

exports.complete = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.lessonId);
  if (!lesson) throw notFound('Lesson');

  const progress = await Progress.findOne({
    userId: req.user.id,
    lessonId: lesson._id
  });
  if (!progress) throw notFound('Progress');

  progress.status = 'completed';
  progress.completedAt = new Date();
  await progress.save();

  const user = await User.findById(req.user.id);
  await applyXp(user, lesson.xpReward);

  res.json({
    ok: true,
    data: {
      lessonId: lesson._id,
      completedAt: progress.completedAt,
      xp: user.xp,
      xpReward: lesson.xpReward
    }
  });
});
