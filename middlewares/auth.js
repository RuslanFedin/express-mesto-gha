const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

const JWT_KEY = 'super-duper-very-secret-key';

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized('Необходимо авторизоваться');
  }

  const token = req.cookie.jwt || req.headers.authorization.replace('Bearer', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_KEY);
  } catch (error) {
    throw new Unauthorized('Необходимо авторизоваться');
  }

  req.user = payload;
  next();
};
