import { API_CODES, API_ERRORS, BASE_API_ERRORS } from './types'

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

export class UnauthorizedError extends ApiError {
  message: string

  constructor(message: string = API_ERRORS.INVALID_TOKEN) {
    super()
    this.code = API_CODES.UNAUTHORIZED
    this.message = message
  }
}

export class NotFoundError extends ApiError {
  message: string

  constructor(message: string = BASE_API_ERRORS.NOT_FOUND) {
    super()
    this.code = API_CODES.NOT_FOUND
    this.message = message
  }
}
