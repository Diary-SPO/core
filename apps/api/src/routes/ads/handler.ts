import type { NotificationsResponse } from '@diary-spo/shared'

import { getCookieFromToken } from '@helpers'

import { adsGetFromDB, saveAds } from 'src/models/Ads/actions'
import { createDiaryClient } from 'src/services/DiaryClientService'
import type { WithToken } from '../../types'

type Params = WithToken<{
  spoId: bigint
}>

export const getAds = async ({
  token,
  spoId
}: Params): Promise<NotificationsResponse[]> => {
  const authData = await getCookieFromToken(token)
  let result: NotificationsResponse[]
  try {
    result = await createDiaryClient(authData).getAds()
  } catch {
    return adsGetFromDB(spoId)
  }

  // Попутно сохраняем
  saveAds(result, authData)

  return result
}
