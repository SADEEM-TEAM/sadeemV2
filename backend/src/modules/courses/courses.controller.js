const asyncHandler = require('../../utils/asyncHandler');
const { notFound } = require('../../utils/httpError');
const Course = require('../../models/Course');
const Lesson = require('../../models/Lesson');
const Progress = require('../../models/Progress');

exports.list = asyncHandler(async (req, res) => {
  const courses = await Course.find().sort({ order: 1 }).lean();
  const courseIds = courses.map((c) => c._id);
  const [lessonCounts, progressDocs] = await Promise.all([
    Lesson.aggregate([
      { $match: { courseId: { $in: courseIds } } },
      { $group: { _id: '$courseId', total: { $sum: 1 } } }
    ]),
    Progress.find({ userId: req.user.id, courseId: { $in: courseIds }, status: 'completed' }).lean()
  ]);

  const totalsByCourse = Object.fromEntries(lessonCounts.map((c) => [String(c._id), c.total]));
  const doneByCourse = progressDocs.reduce((acc, p) => {
    acc[String(p.courseId)] = (acc[String(p.courseId)] || 0) + 1;
    return acc;
  }, {});

  const data = courses.map((c) => ({
    ...c,
    progress: {
      total: totalsByCourse[String(c._id)] || 0,
      completed: doneByCourse[String(c._id)] || 0
    }
  }));

  res.json({ ok: true, data });
});

exports.getBySlug = asyncHandler(async (req, res) => {
  const course = await Course.findOne({ slug: req.params.slug }).lean();
  if (!course) throw notFound('Course');
  res.json({ ok: true, data: course });
});
