import { THIRD_SEC } from '../../config/constants.ts'

export const getWeekString = (startDate: Date, endDate: Date) => {
  return `
  ${startDate.getDate()}
  ${startDate.toLocaleString('default', { month: 'long' }).slice(0, 3)}
    -
    ${endDate.getDate()}
    ${endDate.toLocaleString('default', { month: 'long' }).slice(0, 3)}`
}

export const isNeedToGetNewData = (): boolean => {
  const getLastRequestTime = localStorage.getItem('lastFetchTime')

  if (!getLastRequestTime) {
    return true
  }

  const currentTime = Date.now()
  const timeSinceLastRequest = currentTime - Number(getLastRequestTime)
  console.error(timeSinceLastRequest)
  console.warn(timeSinceLastRequest > THIRD_SEC)
  return timeSinceLastRequest > THIRD_SEC
}
