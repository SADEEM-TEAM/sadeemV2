const asyncHandler = require('../../utils/asyncHandler');
const { conflict, unauthorized } = require('../../utils/httpError');
const User = require('../../models/User');
const { signToken } = require('../../middleware/auth');

exports.register = asyncHandler(async (req, res) => {
  const { username, email, password, role = 'student' } = req.body;
  const exists = await User.findOne({ email });
  if (exists) throw conflict('Email already registered');

  const user = await User.create({ username, email, password, role });
  const token = signToken(user);
  res.status(201).json({ ok: true, data: { token, user: user.toPublic() } });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw unauthorized('Invalid credentials');
  const match = await user.comparePassword(password);
  if (!match) throw unauthorized('Invalid credentials');

  const token = signToken(user);
  res.json({ ok: true, data: { token, user: user.toPublic() } });
});

exports.logout = (_req, res) => res.json({ ok: true });
