const router = require('express').Router();
const { requireAuth } = require('../../middleware/auth');
const ctrl = require('./lessons.controller');

router.use(requireAuth);
router.get('/roadmap/:courseSlug', ctrl.roadmap);
router.get('/:id', ctrl.getOne);
router.post('/:id/read-receipt', ctrl.readReceipt);

module.exports = router;
