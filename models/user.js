const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    //имя пользователя
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    //информация о пользователе
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    //ссылка на аватарку
    avatar: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
