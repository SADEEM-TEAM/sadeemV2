const asyncHandler = require('../../utils/asyncHandler');
const User = require('../../models/User');

exports.global = asyncHandler(async (_req, res) => {
  const top = await User.find({ role: 'student' })
    .select('username xp streak mascotPref')
    .sort({ xp: -1 })
    .limit(50)
    .lean();
  res.json({ ok: true, data: top });
});
