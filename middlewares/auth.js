// МИДЛВЕР ДЛЯ АВТОРИЗАЦИИ
const { HTTP_STATUS_UNAUTHORIZED } = require("http2").constants; // 401 - Отсутствие токена (JWT), некорректный токен (JWT), невалидный пароль - Unauthorized
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок(токен)
  const { authorization } = req.headers; // const token = req.cookies.jwt;
  // Проверка, если токена нет
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(HTTP_STATUS_UNAUTHORIZED)
      .send({ message: "Передан неверный логин или пароль" });
  }

  // Проверка, если токен не тот
  const token = authorization.replace("Bearer ", ""); // в token запишется только JWT.
  let payload;
  try {
    // Верифицируем токен
    payload = jwt.verify(token, "3f679f11153b904768aaad9d8359fe88");
  } catch (err) {
    // отправим ошибку, если не получилось
    return res
      .status(HTTP_STATUS_UNAUTHORIZED)
      .send({ message: "Передан неверный логин или пароль" });
  }
  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
