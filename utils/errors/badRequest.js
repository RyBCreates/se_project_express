const BAD_REQUEST = 400;

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = BAD_REQUEST;
  }
}

module.exports = { BadRequestError };
