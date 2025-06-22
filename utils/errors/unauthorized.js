const UNAUTHORIZED = 401;

export class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = UNAUTHORIZED;
  }
}
