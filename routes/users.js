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

userRouter.get('/users/me', getMe);
userRouter.get('/users', getUsers);
userRouter.get('/users/:userId', getUserValidity, getUser);
userRouter.patch('/users/me', updateUserValidiry, updateUser);
userRouter.patch('/users/me/avatar', updateAvatarValidity, updateAvatar);

module.exports = userRouter;
