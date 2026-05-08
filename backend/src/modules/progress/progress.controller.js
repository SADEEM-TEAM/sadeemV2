const asyncHandler = require('../../utils/asyncHandler');
const Progress = require('../../models/Progress');

exports.me = asyncHandler(async (req, res) => {
  const items = await Progress.find({ userId: req.user.id }).lean();
  res.json({ ok: true, data: items });
});
