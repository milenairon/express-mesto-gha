const Card = require("../models/card");

const { HTTP_STATUS_BAD_REQUEST } = require("http2").constants; // 400
const { HTTP_STATUS_INTERNAL_SERVER_ERROR } = require("http2").constants; // 500

const NotFoundError = require("../errors/NotFoundError");

//КОНТРОЛЛЕРЫ
/*Контроллер — функция, ответственная за взаимодействие с моделью.
То есть это функция, которая выполняет создание, чтение, обновление
или удаление документа.*/

// возвращает все карточки
getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === "CastError" || err.name === "ValidationError") {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: `Переданы некорректные данные при создании карточки`,
        });
      } else {
        return res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: `Ошибка по-умолчанию` });
      }
    });
};

// создаёт карточку
createCard = (req, res) => {
  //console.log(req.user._id); // _id станет доступен
  const userId = req.user._id;
  const { name, link } = req.body;
  // записываем данные в базу
  Card.create({ name, link, owner: userId })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError" || err.name === "ValidationError") {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: `Переданы некорректные данные при создании карточки`,
        });
      } else {
        return res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: `Ошибка по-умолчанию` });
      }
    });
};

// удаляет карточку по идентификатору
deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Карточка не найдена");
      } else {
        return Card.findByIdAndDelete(cardId).then(() => {
          res.send({ message: "Карточка удалена!" });
        });
      }
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

// поставить лайк карточке
likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .orFail(() => new NotFoundError("Передан несуществующий _id карточки."))
    .catch((err) => {
      if (err.name === "CastError" || err.name === "ValidationError") {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: `Переданы некорректные данные при создании карточки`,
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

// убрать лайк с карточки
dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .orFail(() => new NotFoundError("Передан несуществующий _id карточки."))
    .catch((err) => {
      if (err.name === "CastError" || err.name === "ValidationError") {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: `Переданы некорректные данные при создании карточки`,
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

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };
