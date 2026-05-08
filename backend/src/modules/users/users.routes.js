const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../../middleware/validate');
const { requireAuth } = require('../../middleware/auth');
const ctrl = require('./users.controller');

router.use(requireAuth);

router.get('/me', ctrl.me);

router.patch(
  '/me/onboarding',
  [
    body('age').optional().isInt({ min: 5, max: 25 }),
    body('gradeLabel').optional().isString(),
    body('establishment').optional().isString(),
    body('mascotPref').optional().isIn(['blue', 'pink']),
    body('dailyGoalXp').optional().isInt({ min: 5, max: 200 })
  ],
  validate,
  ctrl.updateOnboarding
);

router.patch(
  '/me',
  [body('mascotPref').optional().isIn(['blue', 'pink'])],
  validate,
  ctrl.updateMe
);

module.exports = router;
