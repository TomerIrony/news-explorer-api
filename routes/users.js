const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const { createUser, login, getUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/users/me', auth, getUser);
router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login
);
router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email(),
      password: Joi.string().required().min(8),
      name: Joi.string(),
    }),
  }),
  createUser
);
router.use(errors());

module.exports = router;
