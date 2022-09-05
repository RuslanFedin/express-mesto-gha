const cardRouter = require('express').Router();
const {
  createCardValidity,
  idValidity,
} = require('../middlewares/validity');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRouter.get('', getCards);
cardRouter.post('', createCardValidity, createCard);
cardRouter.delete('/:cardId', idValidity, deleteCard);
cardRouter.put('/:cardId/likes', idValidity, likeCard);
cardRouter.delete('/:cardId/likes', idValidity, dislikeCard);

module.exports = cardRouter;
