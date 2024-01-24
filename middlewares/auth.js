// МИДЛВЕР ДЛЯ АВТОРИЗАЦИИ
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок(токен)
  const { authorization } = req.headers; // const token = req.cookies.jwt;
  // Проверка, если токена нет
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Передан неверный логин или пароль'));
  }

  // Проверка, если токен не тот
  const token = authorization.replace('Bearer ', ''); // в token запишется только JWT.
  let payload;
  try {
    // Верифицируем токен
    payload = jwt.verify(token, '3f679f11153b904768aaad9d8359fe88');
  } catch (err) {
    // отправим ошибку, если не получилось
    return next(new UnauthorizedError('Передан неверный логин или пароль'));
  }
  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
