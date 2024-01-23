import { THIRD_SEC } from '@config'

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

  return timeSinceLastRequest > THIRD_SEC
}
