const { logger } = require('../utils/logger');

exports.notFound = (req, res, _next) => {
  res.status(404).json({ ok: false, error: 'route_not_found', path: req.path });
};

exports.errorHandler = (err, _req, res, _next) => {
  const status = err.status || 500;
  if (status >= 500) logger.error(err.stack || err);
  res.status(status).json({
    ok: false,
    error: err.code || err.name || 'error',
    message: err.message,
    details: err.details
  });
};
