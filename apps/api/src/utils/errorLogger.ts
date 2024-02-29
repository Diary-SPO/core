export const errorLogger = (e: string) => {
  if (e.indexOf('error') > -1) {
    console.error(e)
  }
}
