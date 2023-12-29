const { HTTP_STATUS_BAD_REQUEST } = require("http2").constants; // 400
const { HTTP_STATUS_INTERNAL_SERVER_ERROR } = require("http2").constants; // 500
const Card = require("../models/card");
const NotFoundError = require("../errors/NotFoundError");

// КОНТРОЛЛЕРЫ
// Контроллер — функция, ответственная за взаимодействие с моделью.
// То есть это функция, которая выполняет создание, чтение, обновление
// или удаление документа.

// возвращает все карточки
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      switch (err.name) {
        case "CastError":
          return res.status(HTTP_STATUS_BAD_REQUEST).send({
            message: "Переданы некорректные данные",
          });
        case "ValidationError":
          return res.status(HTTP_STATUS_BAD_REQUEST).send({
            message: "Переданы некорректные данные",
          });

        default:
          return res
            .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
            .send({ message: "Ошибка по-умолчанию" });
      }
    });
};

// создаёт карточку
const createCard = (req, res) => {
  const userId = req.user._id;
  const { name, link } = req.body;
  // записываем данные в базу
  Card.create({ name, link, owner: userId })
    .then((card) => res.send({ data: card }))
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

        default:
          return res
            .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
            .send({ message: "Ошибка по-умолчанию" });
      }
    });
};

// удаляет карточку по идентификатору
const deleteCard = (req, res) => {
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
      switch (err.name) {
        case "NotFoundError":
          return res.status(err.statusCode).send({ message: err.message });

        default:
          return res
            .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
            .send({ message: "Ошибка по-умолчанию" });
      }
    });
};

// поставить лайк карточке
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .orFail(() => new NotFoundError("Передан несуществующий _id карточки."))
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

        default:
          return res
            .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
            .send({ message: "Ошибка по-умолчанию" });
      }
    });
};

// убрать лайк с карточки
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .orFail(() => new NotFoundError("Передан несуществующий _id карточки."))
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
            .send({ message: "Ошибка по-умолчанию" });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
