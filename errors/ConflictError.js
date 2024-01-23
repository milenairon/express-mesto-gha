const { HTTP_STATUS_CONFLICT } = require('http2').constants; // 409 - Попытка зарегистрировать вторую учетную запись на тот же email - Conflict

module.exports = class ConflictError extends Error {
  constructor(message) {
    super();
    this.name = 'ConflictError';
    this.statusCode = HTTP_STATUS_CONFLICT;
    this.message = message;
  }
};
