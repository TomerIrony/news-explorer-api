const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const auth = require('../middlewares/auth');
const deleteArticle = require('../middlewares/deleteArticle');

const {
  deleteArticleById,
  createArticle,
  getSavedArticles,
} = require('../controllers/articles');

router.post(
  '/articles',
  celebrate({
    body: Joi.object().keys({
      keyword: Joi.string(),
      title: Joi.string(),
      date: Joi.string(),
      source: Joi.string(),
      link: Joi.string(),
      image: Joi.string(),
    }),
  }),
  auth,
  createArticle
);
router.get('/articles', auth, getSavedArticles);
router.delete('/articles/:articleId', auth, deleteArticle, deleteArticleById);

router.use(errors());

module.exports = router;
