const mongoose = require('mongoose');

const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    // имя пользователя
    name: {
      type: String,
      minlength: [2, 'Имя не должно быть короче 2-х символов'],
      maxlength: [30, 'Имя не должно быть длиннее 30-и символов'],
      default: 'Жак-Ив Кусто',
    },
    // информация о пользователе
    about: {
      type: String,
      minlength: [2, 'Описание не должно быть короче 2-х символов'],
      maxlength: [30, 'Описание не должно быть длиннее 30-и символов'],
      default: 'Исследователь',
    },
    // ссылка на аватарку
    avatar: {
      type: String,
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (avatar) => {
          // регулярное выражение
          /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/.test(
            avatar,
          );
        },
        message: 'Передан некорректный электронный адрес',
      },
    },
    email: {
      type: String,
      required: true,
      unique: true, // уникальный
      validate: {
        validator: (email) => validator.isEmail(email),
        message: 'Указана неверная почта',
      },
    },
    password: {
      type: String,
      required: [true, 'Необходимо ввести пароль'],
      select: false, // пароль не возвращается в ответе
    },
  },
  { versionKey: false, timestamps: true },
);

// метод схемы для проверки почты и пароля
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      // проверяет почту
      if (!user) {
        // неправильная почта, перейдем в catch
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      // проверяет хеши паролей
      return bcrypt.compare(password, user.password).then((matched) => {
        // если хэши не совпали
        if (!matched) {
          // неправильный пароль
          return Promise.reject(new Error('Неправильные почта или пароль'));
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
