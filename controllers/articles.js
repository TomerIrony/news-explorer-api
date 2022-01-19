const fetch = require('node-fetch');

const Article = require('../models/acrticle');
const NotFoundError = require('../errors/not-found-err');
const ValdiationError = require('../errors/validation-err');
const CastError = require('../errors/cast-err');
const ServerError = require('../errors/server-err');

module.exports.createArticle = (req, res, next) => {
  const owner = req.user._id;
  // eslint-disable-next-line object-curly-newline
  const { keyword, title, date, source, link, image } = req.body;

  Article.create({
    keyword,
    title,
    date,
    source,
    link,
    image,
    owner,
  })
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
        throw new CastError('Invalid id');
      } else if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('No Card found with that id');
      } else {
        throw new ServerError('Server Error');
      }
    })
    .catch(next);
};

/* https://newsapi.org/v2/everything?q=Apple&from=2022-01-18&sortBy=popularity &apiKey=bcc7bd2b43094a758403e56b5af1e479
 */

module.exports.getArticles = (req, res, next) => {
  let currentDateObj = new Date();
  const currentDateJson = JSON.stringify(currentDateObj).split('T');
  const currentDate = currentDateJson[0].split('"')[1];
  const d = new Date();
  d.setDate(d.getDate() - 7);
  const myJson = JSON.stringify(d).split('T');
  const date = myJson[0].split('"')[1];

  fetch(
    `https://newsapi.org/v2/everything?q=${req.body.q}&from=${date}&to=${currentDate}&pageSize=100&sortBy=popularity&apiKey=bcc7bd2b43094a758403e56b5af1e479`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
    .then((response) => {
      if (response) {
        return response.json();
      }
    })
    .then((text) => {
      res.status(200).send(text);
    });
};

/* getUser(JWT) {
  return fetch(`${this._url}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JWT}`,
    },
  }).then(this._checkResponse);
} */
