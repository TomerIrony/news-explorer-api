const router = require('express').Router();
const { createUser, login, getUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/users/me', auth, getUser);
router.post('/signin', login);
router.post('/signup', createUser);

module.exports = router;
