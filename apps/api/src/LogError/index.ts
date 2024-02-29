export class LogError extends Error {
  message: string

  constructor(message: string) {
    super(message)
    this.message = `[${new Date().toISOString()}] => ${message}`
    Object.setPrototypeOf(this, LogError.prototype)
  }
}
