const bcrypt = require("bcryptjs");

const MONGO_DUBLICATE_ERROR_CODE = 11000;
const SOLT_ROUND = 10;

const jwt = require("jsonwebtoken");
// const { MongoServerError } = require("mongodb");
const User = require("../models/user");
const BadRequestError = require("../errors/BadRequestError"); // 400
const UnauthorizedError = require("../errors/UnauthorizedError"); // 401
const NotFoundError = require("../errors/NotFoundError"); // 404
const ConflictError = require("../errors/ConflictError"); // 409

// КОНТРОЛЛЕРЫ

// Возвращает всех пользователей
const getUsers = (req, res, next) => {
  User.find({})
    // возвращаем записанные в базу данные пользователю
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      next(err);
    });
};

// Возвращает текущего пользователя
const getCurrentUser = (req, res, next) => {
  const userId = req.user._id; // А НЕ ТАК ЛИ СДЕЛАТЬ const { userId } = req.user;???????????????
  User.findOne({ _id: userId })
    .then((user) => {
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      next(err);
    });
};

// Возвращает пользователя по _id
const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => new NotFoundError("Пользователь по указанному _id не найден"))
    .then((user) => {
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      switch (err.name) {
        case "NotFoundError":
          return next(new NotFoundError(err.mesage));
        case "CastError":
          return next(
            new BadRequestError(
              "Переданы некорректные данные при обновлении профиля"
            )
          );

        default:
          return next(err);
      }
    });
};

// Создаёт пользователя (Регистрация)
const createUser = async (req, res, next) => {
  // получим из объекта запроса данные пользователя
  try {
    const { name, about, avatar, email, password } = req.body || {};
    const hash = await bcrypt.hash(password, SOLT_ROUND);
    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    res.status(201).send(newUser);
  } catch (err) {
    if (
      err.code === MONGO_DUBLICATE_ERROR_CODE || err.name === "MongoServerError"
    ) {
      next(
        new ConflictError(
          "При регистрации указан email, который уже существует на сервере"
        )
      );
    } else if (err.name === "ValidationError") {
      next(
        new BadRequestError("Переданы некорректные данные при создании профиля")
      );
    } else if (err.name === "NotFoundError") {
      next(new NotFoundError(err.message));
    } else {
      next(err);
    }
  }
  // const { name, about, avatar, email, password } = req.body;
  // bcrypt
  //   .hash(password, SOLT_ROUND)
  //   .then((hash) => {
  //     User.create({ name, about, avatar, email, password: hash }).then(
  //       (user) => {
  //         console.log(user);
  //         res.status(201).send({
  //           name,
  //           about,
  //           avatar,
  //           email,
  //           _id: user._id,
  //         });
  //       }
  //     );
  //   })
  //   .catch((err) => {
  // if (err.code === 11000 || err.name === "MongoServerError") {
  //   // res.status(422).send({ succes: false, message: "User already exist!" });
  //   next(
  //     new ConflictError(
  //       "При регистрации указан email, который уже существует на сервере"
  //     )
  //   );
  // } else if (err.name === "ValidationError") {
  //   next(
  //     new BadRequestError(
  //       "Переданы некорректные данные при создании профиля"
  //     )
  //   );
  // } else if (err.name === "NotFoundError") {
  //   next(new NotFoundError(err.message));
  // } else {
  //   next(err);
  // }
  //   });
};

// Ообновляет профиль
const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(() => new NotFoundError("Пользователь по указанному _id не найден"))
    .then((user) => {
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email, // _id: req.user._id или _id
      });
    })
    .catch((err) => {
      switch (err.name) {
        case "CastError":
          return next(
            new BadRequestError(
              "Переданы некорректные данные при обновлении профиля"
            )
          );
        case "ValidationError":
          return next(
            new BadRequestError(
              "Переданы некорректные данные при обновлении профиля"
            )
          );
        case "NotFoundError":
          return next(new NotFoundError(err.message));

        default:
          return next(err);
      }
    });
};

// Обновляет аватар
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError("Пользователь по указанному _id не найден"))
    .then((user) => {
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email, // _id: req.user._id или _id
      });
    })
    .catch((err) => {
      switch (err.name) {
        case "ValidationError":
          return next(
            new BadRequestError(
              "Переданы некорректные данные при обновлении аватара"
            )
          );
        case "CastError":
          return next(
            new BadRequestError(
              "Переданы некорректные данные при обновлении аватара"
            )
          );
        case "NotFoundError":
          return next(new NotFoundError(err.message));

        default:
          return next(err);
      }
    });
};

// Получает из запроса почту и пароль и проверяет их
const login = (req, res, next) => {
  console.log(0);
  // ищет по емаил пользователя
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      console.log(1);
      const token = jwt.sign(
        { _id: user._id },
        "3f679f11153b904768aaad9d8359fe88" // сгенерирован crypto
      );
      // сохранить токен в куки
      res.send({ _id: token });
      console.log(2);
      //   .cookie("jwt", token, {
      //     // token - наш JWT токен, который мы отправляем
      //     maxAge: 3600000 * 24 * 7,
      //     httpOnly: true, // Такую куку нельзя прочесть из JavaScript
      //   })
      // .send({ _id: token });
    })
    .catch(() => {
      console.log(3);
      next(new UnauthorizedError("Передан неверный логин или пароль"));
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  login,
  getCurrentUser,
};
