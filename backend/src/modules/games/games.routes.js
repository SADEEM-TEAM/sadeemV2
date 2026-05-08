const router = require('express').Router();
const { requireAuth } = require('../../middleware/auth');
const ctrl = require('./games.controller');

router.use(requireAuth);
router.get('/lesson/:lessonId', ctrl.listForLesson);
router.post('/:gameId/submit', ctrl.submit);
router.post('/lesson/:lessonId/complete', ctrl.complete);

module.exports = router;
