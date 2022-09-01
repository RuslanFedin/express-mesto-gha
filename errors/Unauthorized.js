const { UNAUTHORIZED } = require('./statusCodes');

class Unauthorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED;
  }
}

module.exports = Unauthorized;
