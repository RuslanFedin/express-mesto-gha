const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

const JWT_KEY = 'super-duper-very-secret-key';

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_KEY);
  } catch (error) {
    throw new Unauthorized('Необходима авторизация');
  }
  req.user = payload;
  next();
};
