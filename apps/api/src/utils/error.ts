export const error = (message: unknown, ...args: (unknown | Error)[]) => {
  return console.error(`[handle error] ${message}`, ...args)
}
