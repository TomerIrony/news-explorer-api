const router = require('express').Router();
const auth = require('../middlewares/auth');
const deleteArticle = require('../middlewares/deleteArticle');
const { celebrate, Joi } = require('celebrate');

const {
  deleteArticleById,
  createArticle,
  getSavedArticles,
} = require('../controllers/articles');

router.post('/articles', auth, createArticle);
router.get('/articles', auth, getSavedArticles);
router.delete('/articles/:articleId', auth, deleteArticle, deleteArticleById);

module.exports = router;
