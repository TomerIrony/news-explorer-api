const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const ValdiationError = require('../errors/validation-err');
const ConflitError = require('../errors/confilt-err');
const CastError = require('../errors/confilt-err');
const ServerError = require('../errors/server-err');
const AuthorizationError = require('../errors/auth-err');

require('dotenv').config();

module.exports.getUser = (req, res, next) => {
  User.findById({ _id: req.user._id })
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new CastError('Invalid ID');
      } else if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('No User found with that id');
      } else {
        throw new ServerError('Server Error');
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  if (req.body.password === undefined) {
    throw new ValdiationError('didnt meet the requirements');
  } else if (req.body.name === undefined) {
    throw new ValdiationError('didnt meet the requirements');
  } else if (req.body.email === undefined) {
    throw new ValdiationError('didnt meet the requirements');
  }
  bcrypt.hash(req.body.password, 10).then((hash) => {
    User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    })
      .then((user) => {
        // eslint-disable-next-line no-unused-vars
        const { password, ...resoponseUser } = user._doc;
        res.send(resoponseUser);
      })
      .catch((err) => {
        if (err.code === 11000) {
          throw new ConflitError('email is already in use');
        } else {
          if (err.name === 'ValidationError') {
            throw new ValdiationError('didnt meet the requirements');
          }

          throw new ServerError('Server Error');
        }
      })
      .catch(next);
  });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Inncorrect password or email');
      }
      bcrypt.compare(password, user.password).then((bycrpytres) => {
        if (bycrpytres) {
          return res.send({
            token: jwt.sign(
              { _id: user._id },
              process.env.JWT_SECRET || 'dev',
              {
                expiresIn: '7d',
              }
            ),
          });
        }
        throw new AuthorizationError('UNAUTHORIZED REQUEST');
      });
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        throw new NotFoundError('Inncorrect password or email');
      } else if (err.statusCode === 401) {
        throw new AuthorizationError('UNAUTHORIZED REQUEST');
      }

      throw new ServerError('Server Error');
    })
    .catch(next);
};
