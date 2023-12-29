const { HTTP_STATUS_NOT_FOUND } = require('http2').constants; // 404

module.exports = class NotFoundError extends Error {
  constructor(message) {
    super();
    this.name = 'NotFoundError';
    this.statusCode = HTTP_STATUS_NOT_FOUND;
    this.message = message;
  }
};
