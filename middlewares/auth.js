const jwt = require('jsonwebtoken');
require('dotenv').config();
const AuthorizationError = require('../errors/auth-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthorizationError('Authorization Required');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET || 'dev');
  } catch (err) {
    throw new AuthorizationError('Authorization Required');
  }

  req.user = payload; //

  return next(); //
};
