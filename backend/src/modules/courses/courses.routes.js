const router = require('express').Router();
const { requireAuth } = require('../../middleware/auth');
const ctrl = require('./courses.controller');

router.get('/', requireAuth, ctrl.list);
router.get('/:slug', requireAuth, ctrl.getBySlug);

module.exports = router;
