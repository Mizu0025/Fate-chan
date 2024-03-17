export class MissingModelError extends Error {
  constructor(message: string) {
    super(message);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, MissingModelError.prototype);
  }
}
