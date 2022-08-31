// const { INTERNAL_SERVER_ERROR } = require('../errors/statusCodes');

function handleError(error, req, res, next) {
  const status = error.statusCode || 500;
  const message = error.message || 'На сервере произошла ошибка.';

  res.status(status).send({
    error,
    message,
  });
  next();
}

module.exports = { handleError };
