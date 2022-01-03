const router = require('express').Router();
const auth = require('../middlewares/auth');
const { createUser, login, getUser } = require('../controllers/users');

router.post('/signin', login);
router.post('/signup', createUser);
router.get('/users/me', auth, getUser);

module.exports = router;
