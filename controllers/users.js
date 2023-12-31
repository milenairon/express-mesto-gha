const { HTTP_STATUS_BAD_REQUEST } = require("http2").constants; // 400
const { HTTP_STATUS_INTERNAL_SERVER_ERROR } = require("http2").constants; // 500

const User = require("../models/user");
const NotFoundError = require("../errors/NotFoundError");

// КОНТРОЛЛЕРЫ

// Возвращает всех пользователей
const getUsers = (req, res) => {
  User.find({})
    // возвращаем записанные в базу данные пользователю
    .then((users) => res.send({ data: users }))
    .catch(() => {
      res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: "На сервере произошла ошибка" });
    });
};

// Возвращает пользователя по _id
const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => new NotFoundError("Пользователь по указанному _id не найден"))
    .then((user) => {
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      switch (err.name) {
        case "NotFoundError":
          return res.status(err.statusCode).send({
            message: err.message,
          });
        case "CastError":
          return res.status(HTTP_STATUS_BAD_REQUEST).send({
            message: "Переданы некорректные данные при обновлении профиля",
          });

        default:
          return res
            .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
            .send({ message: "На сервере произошла ошибка" });
      }
    });
};

// Создаёт пользователя
const createUser = (req, res) => {
  // получим из объекта запроса данные пользователя
  const { name, about, avatar } = req.body;
  // записываем данные в базу
  User.create({ name, about, avatar })
    .then((user) => {
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      switch (err.name) {
        case "ValidationError":
          return res.status(HTTP_STATUS_BAD_REQUEST).send({
            message: "Переданы некорректные данные при обновлении профиля",
          });
        case "NotFoundError":
          return res.status(err.statusCode).send({
            message: err.message,
          });

        default:
          return res
            .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
            .send({ message: "На сервере произошла ошибка" });
      }
    });
};

// Ообновляет профиль
const updateUser = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => new NotFoundError("Пользователь по указанному _id не найден"))
    .then((user) => {
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      switch (err.name) {
        case "CastError":
          return res.status(HTTP_STATUS_BAD_REQUEST).send({
            message: "Переданы некорректные данные при обновлении профиля",
          });
        case "ValidationError":
          return res.status(HTTP_STATUS_BAD_REQUEST).send({
            message: "Переданы некорректные данные при обновлении профиля",
          });
        case "NotFoundError":
          return res.status(err.statusCode).send({
            message: err.message,
          });

        default:
          return res
            .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
            .send({ message: "На сервере произошла ошибка" });
      }
    });
};

// Обновляет аватар
const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError("Пользователь по указанному _id не найден"))
    .then((user) => {
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      switch (err.name) {
        case "ValidationError":
          return res.status(HTTP_STATUS_BAD_REQUEST).send({
            message: "Переданы некорректные данные при обновлении аватара",
          });
        case "CastError":
          return res.status(HTTP_STATUS_BAD_REQUEST).send({
            message: "Переданы некорректные данные при обновлении аватара",
          });
        case "NotFoundError":
          return res.status(err.statusCode).send({
            message: err.message,
          });

        default:
          return res
            .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
            .send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
};
