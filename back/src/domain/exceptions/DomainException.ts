export class DomainException extends Error {
  public readonly code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = 'DomainException';
    if (code !== undefined) {
      this.code = code;
    }

    // Maintient la chaîne de prototypes correcte
    Object.setPrototypeOf(this, DomainException.prototype);
  }
}