export const checkInterval = (
  lastDatetimeRunning: Date,
  interval: number
): boolean => {
  const currTime = new Date().getTime()
  const lastTime = lastDatetimeRunning.getTime()
  const median = (currTime - lastTime) / 1000

  return median > interval
}
