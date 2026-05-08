const jwt = require('jsonwebtoken');
const { unauthorized, forbidden } = require('../utils/httpError');

const SECRET = process.env.JWT_SECRET || 'change-me-in-production';

exports.requireAuth = (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(unauthorized('Missing token'));
  try {
    const payload = jwt.verify(token, SECRET);
    req.user = { id: payload.sub, role: payload.role, mascotPref: payload.mascotPref };
    next();
  } catch {
    next(unauthorized('Invalid or expired token'));
  }
};

exports.requireRole = (...roles) => (req, _res, next) => {
  if (!req.user) return next(unauthorized());
  if (!roles.includes(req.user.role)) return next(forbidden('Role not allowed'));
  next();
};

exports.signToken = (user) =>
  jwt.sign(
    { sub: String(user._id), role: user.role, mascotPref: user.mascotPref },
    SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
