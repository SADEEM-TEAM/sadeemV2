const { validationResult } = require('express-validator');
const { badRequest } = require('../utils/httpError');

module.exports = (req, _res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  next(badRequest('Validation failed', errors.array().map((e) => ({ field: e.path, msg: e.msg }))));
};
