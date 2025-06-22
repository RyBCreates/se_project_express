const { BadRequestError } = require("../errors/badRequest");
const { UnauthorizedError } = require("../errors/unauthorized");
const { ForbiddenError } = require("../errors/forbidden");
const { NotFoundError } = require("../errors/notFound");
const { ConflictError } = require("../errors/conflict");
const { InternalServerError } = require("../errors/internalErrorServer");

module.exports = {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
};
