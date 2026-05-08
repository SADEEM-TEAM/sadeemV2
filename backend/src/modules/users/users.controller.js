const asyncHandler = require('../../utils/asyncHandler');
const { notFound } = require('../../utils/httpError');
const User = require('../../models/User');
const { regenerateHearts } = require('../../services/hearts.service');

exports.me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw notFound('User');
  await regenerateHearts(user);
  res.json({ ok: true, data: user.toPublic() });
});

exports.updateOnboarding = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw notFound('User');

  const { age, gradeLabel, establishment, mascotPref, dailyGoalXp, levelByTopic } = req.body;
  if (age !== undefined) user.onboarding.age = age;
  if (gradeLabel !== undefined) user.onboarding.gradeLabel = gradeLabel;
  if (establishment !== undefined) user.onboarding.establishment = establishment;
  if (dailyGoalXp !== undefined) user.onboarding.dailyGoalXp = dailyGoalXp;
  if (levelByTopic !== undefined) user.onboarding.levelByTopic = levelByTopic;
  if (mascotPref !== undefined) user.mascotPref = mascotPref;
  user.onboarding.completed = true;
  await user.save();

  res.json({ ok: true, data: user.toPublic() });
});

exports.updateMe = asyncHandler(async (req, res) => {
  const updates = {};
  if (req.body.mascotPref) updates.mascotPref = req.body.mascotPref;
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
  if (!user) throw notFound('User');
  res.json({ ok: true, data: user.toPublic() });
});
