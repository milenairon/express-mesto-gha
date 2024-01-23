const { HTTP_STATUS_FORBIDDEN } = require('http2').constants; // 403 - Обновление чужого профиля, чужого аватара, удаление чужой карточки-Authorized but Forbidden

module.exports = class ForbiddenError extends Error {
  constructor(message) {
    super();
    this.name = 'ForbiddenError';
    this.statusCode = HTTP_STATUS_FORBIDDEN;
    this.message = message;
  }
};
