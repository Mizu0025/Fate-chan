export class ImageGenerationError extends Error {
  constructor(message: string) {
    super(message);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ImageGenerationError.prototype);
  }
}
