export const checkInterval = (
  lastDatetimeRunning: Date,
  interval: number
): boolean => {
  const currTime = Date.now()
  const lastTime = lastDatetimeRunning.getTime()
  const median = (currTime - lastTime) / 1000

  return median > interval
}
