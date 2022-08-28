const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const BadRequest = require('../errors/BadRequest');
const { validateUrl } = require('../utils/validateUrl');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: { validator: validateUrl, message: 'не рабочая ссылка' },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(string) {
      if (!isEmail(string)) {
        throw new BadRequest({ message: 'Вы ввели не email' });
      }
    }
  },
  password: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('user', userSchema);
