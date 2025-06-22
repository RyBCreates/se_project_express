const CONFLICT = 409;

export class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConflictError";
    this.statusCode = CONFLICT;
  }
}
