import { THIRD_SEC } from '../../config'

export const isNeedToUpdateCache = (key: string): boolean => {
  const getLastRequestTime = localStorage.getItem(key)

  if (!getLastRequestTime) {
    return true
  }

  const currentTime = Date.now()
  const timeSinceLastRequest = currentTime - Number(getLastRequestTime)

  return timeSinceLastRequest > THIRD_SEC
}
