const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const cardSchema = new mongoose.Schema(
  {
    // имя карточки
    name: {
      type: String,
      minlength: [2, 'Имя должно быть не менее 2 символов'],
      maxlength: [30, 'Имя должно быть не более 30 символов'],
      required: true,
    },
    // ссылка на картинку
    link: {
      type: String,
      required: true,
      validate: {
        validator: (avatar) => {
          /https?:\/\/(www\.)?[a-zA-Z0-9-@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([a-zA-Z0-9()-@:%_+.~#?&//=]*)/.test(
            avatar,
          );
        }, // регулярное выражение
        message: 'Передан некорректный электронный адрес',
      },
    },
    // ссылка на модель автора карточки
    owner: {
      type: ObjectId,
      required: true,
    },
    // список лайкнувших пост пользователей
    likes: [
      {
        type: ObjectId,
        default: [],
      },
    ],
    // дата создания
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('card', cardSchema);
