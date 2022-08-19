const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const NOT_FOUND = require('./errors/statusCodes');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
});

app.use(express.json());
app.use('/', usersRouter);
app.use((req, res, next) => {
  req.user = {
    _id: '62fd4e45a87ad36496bd45c7',
  };
  next();
});
app.use('/', cardRouter);
app.use('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: `Страница не найдена ${error}` });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
