const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../../middleware/validate');
const ctrl = require('./auth.controller');

router.post(
  '/register',
  [
    body('username').trim().isLength({ min: 2, max: 40 }),
    body('email').isEmail(),
    body('password').isLength({ min: 6, max: 64 }),
    body('role').optional().isIn(['student', 'teacher', 'parent'])
  ],
  validate,
  ctrl.register
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').isString().notEmpty()],
  validate,
  ctrl.login
);

router.post('/logout', ctrl.logout);

module.exports = router;
