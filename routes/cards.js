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

cardRouter.get('/cards', getCards);
cardRouter.post('/cards', createCardValidity, createCard);
cardRouter.delete('/cards/:cardId', idValidity, deleteCard);
cardRouter.put('/cards/:cardId/likes', idValidity, likeCard);
cardRouter.delete('/cards/:cardId/likes', idValidity, dislikeCard);

module.exports = cardRouter;
