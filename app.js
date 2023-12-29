const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const { PORT = 3000 } = process.env;

const mongoose = require("mongoose");

const NotFoundError = require("./errors/NotFoundError");

// Подключаемся к серверу Mongo
mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

// Временное решение авторизации
app.use((req, res, next) => {
  req.user = {
    _id: "658bafebe67edb02cc13b579", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

// Сборка пакетов
app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.use("/", require("./routes/users"));
app.use("/", require("./routes/cards"));

app.listen(PORT);
