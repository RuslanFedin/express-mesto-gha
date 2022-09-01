const { BAD_REQUEST } = require('./statusCodes');

class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST;
  }
}

module.exports = BadRequest;
