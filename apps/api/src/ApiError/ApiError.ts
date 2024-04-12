import { API_CODES } from './types'

export class ApiError extends Error {
  code: number
  message: string

  constructor(message: string, code: number) {
    super(message)
    this.code = code
    this.message = message
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(message, API_CODES.NOT_FOUND)
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string) {
    super(message, API_CODES.UNAUTHORIZED)
    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string) {
    super(message, API_CODES.FORBIDDEN)
    Object.setPrototypeOf(this, ForbiddenError.prototype)
  }
}

export class UnknownError extends ApiError {
  constructor(message: string) {
    super(message, API_CODES.UNKNOWN_ERROR)
    Object.setPrototypeOf(this, UnknownError.prototype)
  }
}
