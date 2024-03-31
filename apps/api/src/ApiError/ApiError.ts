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
