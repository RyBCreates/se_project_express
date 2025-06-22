const FORBIDDEN = 403;

export class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = "ForbiddenError";
    this.statusCode = FORBIDDEN;
  }
}
