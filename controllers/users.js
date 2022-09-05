const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFound = require('../errors/NotFound');
const Conflict = require('../errors/Conflict');
const BadRequest = require('../errors/BadRequest');

const JWT_KEY = 'super-duper-very-secret-key';

const { HAS_BEEN_CREATED } = require('../errors/statusCodes');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_KEY, { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFound('Пользователь не найден');
    })
    .then((user) => res.send({ user }))
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Неверный запрос'));
      } else {
        next(error);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
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
      throw new NotFound('Пользователь не найден');
    })
    .then((user) => res.send({ user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Введены некорректные данные'));
      } else if (error.name === 'NotFound') {
        next(new NotFound('Пользователь не найден'));
      } else {
        next(error);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
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
      throw new NotFound('Пользователь не найден');
    })
    .then((user) => res.send({ user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Введены некорректные данные'));
      } else if (error.name === 'NotFound') {
        next(new NotFound('Пользователь не найден'));
      } else {
        next(error);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
        about,
        avatar,
      })
        .then((user) => {
          res.status(HAS_BEEN_CREATED).send({
            email: user.email,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            _id: user._id,
          });
        })
        .catch((error) => {
          if (error.code === 11000) {
            next(new Conflict('Пользователь уже существует'));
          } else if (error.name === 'ValidationError') {
            next(new BadRequest('Введены некорректные данные'));
          }
          next(error);
        });
    });
};

module.exports.getMe = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => {
      throw new NotFound('Пользователь не найден');
    })
    .then((user) => {
      res.send({ user });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('неправильный запрос'));
      } else {
        next(error);
      }
    });
};
