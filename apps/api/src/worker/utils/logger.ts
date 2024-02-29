export const logger = (nameUtils: string) => {
  return (message: string) => {
    console.log(`WORKER [${nameUtils}]: ${message}`)
  }
}
