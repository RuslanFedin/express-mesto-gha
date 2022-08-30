const { INTERNAL_SERVER_ERROR } = require('../errors/statusCodes');

function handleError(error, req, res, next) {
  if (error.statusCode) {
    res.status(error.statusCode).send({ message: error.message });
  } else {
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
  }
  next();
}

module.exports = { handleError };
