const Card = require('../models/card');
const { NotFound } = require('../errors/NotFound');
const { Forbidden } = require('../errors/Forbidden');
const { BadRequest } = require('../errors/BadRequest');
const { HAS_BEEN_CREATED } = require('../errors/statusCodes');

module.exports.getCards = (req, res, next) => Card.find({})
  .then((cards) => res.send({ cards }))
  .catch(next);

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(HAS_BEEN_CREATED).send({ card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Введены некорректные данные'));
      } else {
        next(error);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFound('Публикация не найдена');
    })
    .then((card) => {
      const ownerId = card.owner.toString();
      const userId = req.user._id;

      if (userId !== ownerId) {
        Card.deleteOne(card)
          .then(() => {
            res.send({ card });
          })
          .catch(next);
      } else {
        throw new Forbidden('Это не ваша пуликация, её удалить нельзя');
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Данные некорректны'));
      } else {
        next(error);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFound('Публикация не найдена');
    })
    .then((card) => {
      res.send({ card });
    })
    .catch((error) => {
      if (error.name === 'NotFound') {
        next(new NotFound('Пост не найден'));
      } else if (error.name === 'CastError') {
        next(new BadRequest('Данные некорректны'));
      } else {
        next(error);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFound('Публикация не найдена');
    })
    .then((card) => {
      res.send({ card });
    })
    .catch((error) => {
      if (error.name === 'NotFound') {
        next(new NotFound('Пост не найден'));
      } else if (error.name === 'CastError') {
        next(new BadRequest('Данные некорректны'));
      } else {
        next(error);
      }
    });
};
