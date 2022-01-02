const router = require('express').Router();
const auth = require('../middlewares/auth');
const { createUser, login, getUser } = require('../controllers/users');

router.get('/users/me', auth, getUser);
router.post('/signin', login);
router.post('/signup', createUser);

module.exports = router;
