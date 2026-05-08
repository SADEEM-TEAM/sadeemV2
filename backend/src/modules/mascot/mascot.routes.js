const router = require('express').Router();
const { requireAuth } = require('../../middleware/auth');
const ctrl = require('./mascot.controller');

router.use(requireAuth);
router.post('/react', ctrl.react);

module.exports = router;
