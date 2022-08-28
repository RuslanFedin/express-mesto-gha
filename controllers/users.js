const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFound = require('../errors/NotFound');
const Conflict = require('../errors/Conflict');
const BadRequest = require('../errors/BadRequest');
const Unauthorized = require('../errors/Unauthorized');
const {
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
        res.status(BAD_REQUEST).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Возникла ошибка на сервере' });
      }
    });
};

module.exports.getUser = (req, res) => User.findById(req.params.userId)
  .orFail(() => {
    throw new NotFound();
  })
  .then((user) => res.send({ user }))
  .catch((error) => {
    if (error.name === 'NotFound') {
      res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
    } else if (error.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Неверный запрос' });
    } else {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Возникла ошибка на сервере' });
    }
  });

module.exports.getUsers = (req, res) => User.find({})
  .then((user) => res.send({ user }))
  .catch(() => {
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Возникла ошибка на сервере' });
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
    },
  )
    .orFail(() => {
      throw new NotFound();
    })
    .then((user) => res.send({ user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Введены некорректные данные' });
      } else if (error.name === 'NotFound') {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Возникла ошибка на сервере' });
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
    },
  )
    .orFail(() => {
      throw new NotFound();
    })
    .then((user) => res.send({ user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Введены некорректные данные' });
      } else if (error.name === 'NotFound') {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Возникла ошибка на сервере' });
      }
    });
};

module.exports.createUser = (res, req, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      const userData = {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      };
      res.status(HAS_BEEN_CREATED).send(userData);
    })
    .catch((error) => {
      if (error.code === 11000) {
        next(new Conflict('Такой пользователь уже есть'));
      } else if (error.name === 'ValidationError') {
        next(new BadRequest('Введены некорректные данные'));
      } else {
        next(error);
      }
    });
};

module.exports.login = (res, req, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-duper-very-secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 604800,
      });
      res.send({ token });
    })
    .catch((error) => {
      next(new Unauthorized(error.message));
    });
};
