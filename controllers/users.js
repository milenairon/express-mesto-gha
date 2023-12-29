//Модели
const User = require("../models/user");
const NotFoundError = require("../errors/NotFoundError");

const { HTTP_STATUS_BAD_REQUEST } = require("http2").constants; // 400
const { HTTP_STATUS_INTERNAL_SERVER_ERROR } = require("http2").constants; // 500

//КОНТРОЛЛЕРЫ
/*Контроллер — функция, ответственная за взаимодействие с моделью.
То есть это функция, которая выполняет создание, чтение, обновление
или удаление документа.*/

//Возвращает всех пользователей
getUsers = (req, res) => {
  User.find({})
    // возвращаем записанные в базу данные пользователю
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === "CastError" || err.name === "ValidationError") {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: `Переданы некорректные данные при создании пользователя`,
        });
      } else {
        return res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: `Ошибка по умолчанию` });
      }
    });
};

//Возвращает пользователя по _id
getUserById = (req, res) => {
  const { userId } = req.params;
  const user = User.findById(userId)
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
      if (err.name === "NotFoundError") {
        return res.status(err.statusCode).send({ message: err.message });
      } else {
        return res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: `Ошибка по-умолчанию` });
      }
    });
};

//Создаёт пользователя
createUser = (req, res) => {
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
      if (err.name === "CastError" || err.name === "ValidationError") {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: `переданы некорректные данные в методы создания пользователя`,
        });
      } else {
        return res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: `ошибка по-умолчанию` });
      }
    });
};

//Ообновляет профиль
updateUser = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { name, about })
    .orFail(() => new NotFoundError("Пользователь по указанному _id не найден"))
    .then((user) =>
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      })
    )
    .catch((err) => {
      if (err.name === "CastError" || err.name === "ValidationError") {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: `Переданы некорректные данные при обновлении профиля`,
        });
      } else if (err.name === "NotFoundError") {
        return res.status(err.statusCode).send({ message: err.message });
      } else {
        return res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: `Ошибка по-умолчанию` });
      }
    });
};

// Обновляет аватар
updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { avatar })
    .orFail(() => new NotFoundError("Пользователь по указанному _id не найден"))
    .then((user) =>
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      })
    )
    .catch((err) => {
      if (err.name === "CastError" || err.name === "ValidationError") {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: `Переданы некорректные данные при обновлении аватара.`,
        });
      } else if (err.name === "NotFoundError") {
        return res.status(err.statusCode).send({ message: err.message });
      } else {
        return res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: `Ошибка по-умолчанию` });
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
