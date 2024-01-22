const express = require("express");
const bodyParser = require("body-parser");
// Если запрос не проходит описанную валидацию,
// celebrate передаст его дальше - в обработчик ошибки
const cookieParser = require("cookie-parser");
const { celebrate, Joi, errors } = require("celebrate");
// Заголовки безопасности проставляются автоматически(безопасность)
const helmet = require("helmet");

const app = express();

const { PORT = 3000 } = process.env;

const mongoose = require("mongoose");
const auth = require("./middlewares/auth");
const { login, createUser } = require("./controllers/users");
const limiter = require("./middlewares/rateLimiter");

const handleErrors = require("./middlewares/handleErrors");

app.use(helmet());
app.use(cookieParser());
app.use(limiter);

// app.get("/", (req, res) => {
//   // Cookies that have not been signed
//   console.log("Cookies: ", req.cookies);
//   // Cookies that have been signed
//   console.log("Signed Cookies: ", req.signedCookies);
// });

// Подключаемся к серверу Mongo
mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

// Сборка пакетов
app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

// Аутентификация
app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login
);

// Регистрация
app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
      ),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  createUser
);

app.use("/", auth, require("./routes/users"));
app.use("/", auth, require("./routes/cards"));

// Обработчик ошибок celebrate
app.use(errors());
app.all("*", (req, res) => {
  res.status(404).send({ message: "Страница не найдена" });
});

// Централизованная обработка ошибок
app.use(handleErrors);

app.listen(PORT);
