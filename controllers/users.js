const User = require('../models/user');
const NotFoud = require('../errors/NotFound');
const {
  STATUS_OK,
  HAS_BEEN_CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../errors/statusCodes');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(HAS_BEEN_CREATED).send({ user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: `Введены некорректные данные ${error}` });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: `Возникла ошибка на сервере ${error}` });
      }
    });
};

module.exports.getUser = (req, res) => User.findById(req.params.userId)
  .orFail(() => {
    throw new NotFoud();
  })
  .then((user) => res.status(STATUS_OK).send({ user }))
  .catch((error) => {
    if (error.name === 'NotFound') {
      res.status(NOT_FOUND).send({ message: `Пользователь не найден ${error}` });
    } else if (error.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: `Неверный запрос ${error}` });
    } else {
      res.status(INTERNAL_SERVER_ERROR).send({ message: `Возникла ошибка на сервере ${error}` });
    }
  });

module.exports.getUsers = (req, res) => User.find({})
  .then((user) => res.status(STATUS_OK).send({ user }))
  .catch((error) => {
    res.status(INTERNAL_SERVER_ERROR).send({ message: `Возникла ошибка на сервере ${error}` });
  });

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      about,
    },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(() => {
      throw new NotFoud();
    })
    .then((user) => res.status(HAS_BEEN_CREATED).send({ user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: `Введены некорректные данные ${error}` });
      } else if (error.name === 'NotFound') {
        res.status(NOT_FOUND).send({ message: `Пользователь не найден ${error}` });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: `Возникла ошибка на сервере ${error}` });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(() => {
      throw new NotFoud();
    })
    .then((user) => res.status(HAS_BEEN_CREATED).send({ user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: `Введены некорректные данные ${error}` });
      } else if (error.name === 'NotFound') {
        res.status(NOT_FOUND).send({ message: `Пользователь не найден ${error}` });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: `Возникла ошибка на сервере ${error}` });
      }
    });
};
