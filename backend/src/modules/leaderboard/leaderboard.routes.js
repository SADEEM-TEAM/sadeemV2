const router = require('express').Router();
const { requireAuth } = require('../../middleware/auth');
const ctrl = require('./leaderboard.controller');

router.use(requireAuth);
router.get('/', ctrl.global);

module.exports = router;
