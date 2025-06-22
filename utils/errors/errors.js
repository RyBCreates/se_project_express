const { BadRequestError } = require("./badRequest");
const { UnauthorizedError } = require("./unauthorized");
const { ForbiddenError } = require("./forbidden");
const { NotFoundError } = require("./notFound");
const { ConflictError } = require("./conflict");
const { InternalServerError } = require("./internalErrorServer");

module.exports = {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
};
