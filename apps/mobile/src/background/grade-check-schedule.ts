export const NIGHT_INTERVAL_MINUTES = 120

export const isGradeCheckNight = (date: Date) => {
  const hour = date.getHours()
  return hour >= 20 || hour < 6
}

export const getGradeCheckInterval = (
  date: Date,
  configuredIntervalMinutes: number
) =>
  isGradeCheckNight(date)
    ? Math.max(configuredIntervalMinutes, NIGHT_INTERVAL_MINUTES)
    : configuredIntervalMinutes

export const shouldRunGradeCheck = (
  now: Date,
  lastCheck: number,
  configuredIntervalMinutes: number
) =>
  !lastCheck ||
  now.getTime() - lastCheck >=
    getGradeCheckInterval(now, configuredIntervalMinutes) * 60 * 1000
