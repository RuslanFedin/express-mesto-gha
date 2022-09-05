const userRouter = require('express').Router();

const {
  getUserValidity,
  updateUserValidiry,
  updateAvatarValidity,
} = require('../middlewares/validity');

const {
  getUser,
  getUsers,
  updateUser,
  updateAvatar,
  getMe,
} = require('../controllers/users');

userRouter.get('/me', getMe);
userRouter.get('', getUsers);
userRouter.get('/:userId', getUserValidity, getUser);
userRouter.patch('/me', updateUserValidiry, updateUser);
userRouter.patch('/me/avatar', updateAvatarValidity, updateAvatar);

module.exports = userRouter;
