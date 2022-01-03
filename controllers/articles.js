const Article = require('../models/acrticle');
const NotFoundError = require('../errors/not-found-err');
const ValdiationError = require('../errors/validation-err');
const CastError = require('../errors/cast-err');
const ServerError = require('../errors/server-err');

module.exports.createArticle = (req, res, next) => {
  const owner = req.user._id;
  const { keyword, title, date, source, link, image } = req.body;

  Article.create({ keyword, title, date, source, link, image, owner })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValdiationError('Valdiation Error');
      } else {
        throw new ServerError('Server Error');
      }
    })
    .catch(next);
};

module.exports.getSavedArticles = (req, res) => {
  Article.find({ owner: req.user._id }).then((user) => {
    res.status(200).send(user);
  });
};

module.exports.deleteArticleById = (req, res, next) => {
  Article.findByIdAndDelete({ _id: req.params.articleId })
    .then(() => {
      res.status(200).send({ message: 'Article has been deleted' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        console.log(err);
        throw new CastError('Invalid id');
      } else if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('No Card found with that id');
      } else {
        throw new ServerError('Server Error');
      }
    })
    .catch(next);
};
