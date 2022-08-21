const Card = require('../models/card');
const NotFound = require('../errors/NotFound');
const {
  HAS_BEEN_CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../errors/statusCodes');

module.exports.getCards = (req, res) => Card.find({})
  .then((cards) => res.send({ cards }))
  .catch(() => {
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Возникла ошибка на сервере' });
  });

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(HAS_BEEN_CREATED).send({ card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Возникла ошибка на сервере' });
      }
    });
};

module.exports.deleteCard = (req, res) => Card.findByIdAndRemove(req.params.cardId)
  .orFail(() => {
    throw new NotFound();
  })
  .then((card) => {
    if (!req.user._id) {
      return res.status(BAD_REQUEST).send({ message: 'Это не ваш пост, его удалить нельзя' });
    }
    res.send({ data: card });
  })
  .catch((error) => {
    if (error.name === 'NotFound') {
      res.status(NOT_FOUND).send({ message: 'Пост не найден' });
    } else if (error.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Данные некорректны' });
    } else {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Возникла ошибка на сервере' });
    }
  });

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => {
    throw new NotFound();
  })
  .then((card) => res.send({ data: card }))
  .catch((error) => {
    if (error.name === 'NotFound') {
      res.status(NOT_FOUND).send({ message: 'Пост не найден' });
    } else if (error.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Данные некорректны' });
    } else {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Возникла ошибка на сервере' });
    }
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => {
    throw new NotFound();
  })
  .then((card) => res.send({ data: card }))
  .catch((error) => {
    if (error.name === 'NotFound') {
      res.status(NOT_FOUND).send({ message: 'Пост не найден' });
    } else if (error.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Данные некорректны' });
    } else {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Возникла ошибка на сервере' });
    }
  });
