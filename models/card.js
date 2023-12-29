const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const cardSchema = new mongoose.Schema(
  {
    // имя карточки
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    // сылка на картинку
    link: {
      type: String,
      required: true,
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

module.exports = mongoose.model("card", cardSchema);
