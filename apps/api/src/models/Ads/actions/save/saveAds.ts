import type { NotificationsResponse } from '@diary-spo/shared'
import type { ICacheData } from '@helpers'
import { saveAd } from './saveAd'

export const saveAds = async (
  ads: NotificationsResponse[],
  authData: ICacheData
) => {
  const promises = []
  for (const ad of ads) {
    promises.push(saveAd(ad, authData))
  }

  return promises
}
