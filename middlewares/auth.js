const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');




module.exports = (req, res, next) => {

  if (!req.headers || !req.headers.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходимо авторизоваться');
  }

  const token = req.cookie.jwt || req.headers.authorization.replace('Bearer', '');
  let payload;

  try {
    payload = jwt.verify(token, 'super-duper-very-secret-key');
  } catch (error) {
    next(new Unauthorized('Необходимо авторизоваться'));
    return;
  }

  req.user = payload;
  next();
};