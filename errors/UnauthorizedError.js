const { HTTP_STATUS_UNAUTHORIZED } = require('http2').constants; // 401 - Отсутствие токена (JWT), некорректный токен (JWT), невалидный пароль - Unauthorized

module.exports = class UnauthorizedError extends Error {
  constructor(message) {
    super();
    this.name = 'UnauthorizedError';
    this.statusCode = HTTP_STATUS_UNAUTHORIZED;
    this.message = message;
  }
};
