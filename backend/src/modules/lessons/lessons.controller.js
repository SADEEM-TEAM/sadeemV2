const asyncHandler = require('../../utils/asyncHandler');
const { notFound, badRequest } = require('../../utils/httpError');
const Course = require('../../models/Course');
const Lesson = require('../../models/Lesson');
const Progress = require('../../models/Progress');

exports.roadmap = asyncHandler(async (req, res) => {
  const course = await Course.findOne({ slug: req.params.courseSlug });
  if (!course) throw notFound('Course');

  const lessons = await Lesson.find({ courseId: course._id })
    .select('-contentBlocks -hintsAr')
    .sort({ order: 1 })
    .lean();

  const progress = await Progress.find({ userId: req.user.id, courseId: course._id }).lean();
  const progressMap = Object.fromEntries(progress.map((p) => [String(p.lessonId), p]));

  let prevCompleted = true;
  const data = lessons.map((l, i) => {
    const p = progressMap[String(l._id)];
    let status = 'locked';
    if (i === 0 || prevCompleted) status = p?.status === 'completed' ? 'completed' : 'unlocked';
    if (p?.status === 'in_progress') status = 'in_progress';
    if (p?.status === 'completed') status = 'completed';
    prevCompleted = status === 'completed';
    return {
      _id: l._id,
      order: l.order,
      titleAr: l.titleAr,
      titleEn: l.titleEn,
      summaryAr: l.summaryAr,
      illustrationKey: l.illustrationKey,
      xpReward: l.xpReward,
      status
    };
  });

  res.json({ ok: true, data: { course, lessons: data } });
});

exports.getOne = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id).lean();
  if (!lesson) throw notFound('Lesson');
  res.json({ ok: true, data: lesson });
});

exports.readReceipt = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) throw notFound('Lesson');
  const dwellMs = Number(req.body.dwellMs || 0);
  const minDwell = Math.floor(lesson.expectedReadMs * 0.7);
  if (dwellMs < minDwell) throw badRequest('Read time too short', { minDwell, dwellMs });

  let progress = await Progress.findOne({ userId: req.user.id, lessonId: lesson._id });
  if (!progress) {
    progress = await Progress.create({
      userId: req.user.id,
      courseId: lesson.courseId,
      lessonId: lesson._id,
      status: 'in_progress'
    });
  }
  progress.readReceiptIssuedAt = new Date();
  progress.status = 'in_progress';
  await progress.save();

  res.json({ ok: true, data: { issuedAt: progress.readReceiptIssuedAt } });
});
