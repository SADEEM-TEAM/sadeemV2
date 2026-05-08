const router = require('express').Router();
const { requireAuth } = require('../../middleware/auth');
const ctrl = require('./progress.controller');

router.use(requireAuth);
router.get('/me', ctrl.me);

module.exports = router;
