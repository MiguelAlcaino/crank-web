/**
 * Custom error class to handle business logic errors returned by the API (GraphQL).
 */
export class ApiError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message)
    this.name = 'ApiError'

    Object.setPrototypeOf(this, ApiError.prototype)
  }
}
