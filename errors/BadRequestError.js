const { HTTP_STATUS_BAD_REQUEST } = require('http2').constants; // 400 - ValidationError, CastError

module.exports = class BadRequestError extends Error {
  constructor(message) {
    super();
    this.name = 'BadRequestError';
    this.statusCode = HTTP_STATUS_BAD_REQUEST;
    this.message = message;
  }
};
