const INTERNAL_SERVER_ERROR = 500;

export class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.name = "InternalServerError";
    this.statusCode = INTERNAL_SERVER_ERROR;
  }
}
