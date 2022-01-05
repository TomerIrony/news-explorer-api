const Article = require('../models/acrticle');
const NotFoundError = require('../errors/not-found-err');
const AuthorizationError = require('../errors/auth-err');

module.exports = (req, res, next) => {
  Article.findById({ _id: req.params.articleId })
    .select('+owner')
    .then((article) => {
      if (article.owner.toString() === req.user._id) {
        next();
      } else {
        throw new AuthorizationError('Authorization Required');
      }
    })
    .catch((err) => {
      if (err.statusCode === 401) {
        throw new AuthorizationError('Authorization Required');
      }
      throw new NotFoundError('Article not found');
    })
    .catch(next);
};
