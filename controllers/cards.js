const { HTTP_STATUS_CREATED } = require('http2').constants; // 201
const Card = require('../models/card');

const BadRequestError = require('../errors/BadRequestError'); // 400
const ForbiddenError = require('../errors/ForbiddenError'); // 403
const NotFoundError = require('../errors/NotFoundError'); // 404

// КОНТРОЛЛЕРЫ
// Контроллер — функция, ответственная за взаимодействие с моделью.
// То есть это функция, которая выполняет создание, чтение, обновление
// или удаление документа.

// возвращает все карточки
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      next(err);
    });
};

// создаёт карточку
const createCard = (req, res, next) => {
  const userId = req.user._id;
  const { name, link } = req.body;
  // записываем данные в базу
  Card.create({ name, link, owner: userId })
    .then((card) => res.status(HTTP_STATUS_CREATED).send({ data: card }))
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          return next(
            new BadRequestError(
              'Переданы некорректные данные при обновлении профиля',
            ),
          );

        default:
          return next(err);
      }
    });
};

// удаляет карточку по идентификатору
const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Попытка удалить чужую карточку');
      }

      return Card.findByIdAndDelete(cardId).then(() => {
        res.send({ message: 'Карточка удалена!' });
      });
    })
    .catch((err) => {
      switch (err.name) {
        case 'CastError':
          return next(new BadRequestError('Карточка не найдена'));
        case 'NotFoundError':
          return next(new NotFoundError(err.message));
        case 'ForbiddenError':
          return next(new ForbiddenError(err.message));

        default:
          return next(err);
      }
    });
};

// поставить лайк карточке
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => new NotFoundError('Передан несуществующий _id карточки.'))
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      switch (err.name) {
        case 'CastError':
          return next(
            new BadRequestError(
              'Переданы некорректные данные при лайке карточки',
            ),
          );
        case 'ValidationError':
          return next(
            new BadRequestError(
              'Переданы некорректные данные при лайке карточки',
            ),
          );
        case 'NotFoundError':
          return next(new NotFoundError(err.message));

        default:
          return next(err);
      }
    });
};

// убрать лайк с карточки
const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => new NotFoundError('Передан несуществующий _id карточки.'))
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      switch (err.name) {
        case 'CastError':
          return next(
            new BadRequestError(
              'Переданы некорректные данные при дизлайке карточки',
            ),
          );
        case 'ValidationError':
          return next(
            new BadRequestError(
              'Переданы некорректные данные при дизлайке карточки',
            ),
          );
        case 'NotFoundError':
          return next(new NotFoundError(err.message));

        default:
          return next(err);
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
