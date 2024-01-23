const { HTTP_STATUS_INTERNAL_SERVER_ERROR } = require('http2').constants; // 500 - На сервере произошла ошибка

module.exports = class InternalServerError extends Error {
  constructor(message) {
    super();
    this.name = 'InternalServerError';
    this.statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR;
    this.message = message;
  }
};
