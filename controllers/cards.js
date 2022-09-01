const Card = require('../models/card');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ card }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Данные некорректны. '));
      } else {
        next(error);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFound('Публикация не найдена.');
    })
    .then((card) => {
      const owner = card.owner.toString();
      if (req.user._id === owner) {
        Card.deleteOne(card)
          .then(() => {
            res.send({ card });
          })
          .catch(next);
      } else {
        throw new Forbidden('Публикацию удалить невозможно');
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Публикация не найдена.'));
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
      throw new NotFound('Публикация не найдена.');
    })
    .then((card) => res.send({ card }))
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Публикация не найдена.'));
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
      throw new NotFound('Переданы некорректные данные для снятия лайка.');
    })
    .then((card) => res.send({ card }))
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Карточка с указанным _id не найдена.'));
      } else {
        next(error);
      }
    });
};
