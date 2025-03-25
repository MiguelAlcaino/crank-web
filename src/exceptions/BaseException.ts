export class BaseException extends Error {
  constructor(
    public readonly message: string,
    public readonly code: string = 'UNKNOWN_ERROR',
    public readonly data?: any
  ) {
    super(message)
    this.name = this.constructor.name
    // This is necessary in TypeScript to maintain the prototype chain correctly.
    Object.setPrototypeOf(this, new.target.prototype)
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      data: this.data
    }
  }
}
