const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const { handleError } = require('./middlewares/handleError');
const { signInValidity, signUpValidity } = require('./middlewares/validity');
const NotFound = require('./errors/NotFound');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.post('/signin', signInValidity, login);
app.post('/signup', signUpValidity, createUser);

app.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

app.use(auth);

app.use('/', usersRouter);
app.use('/', cardRouter);

app.use(errors());
app.use(handleError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
