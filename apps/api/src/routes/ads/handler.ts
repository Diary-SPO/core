import type { NotificationsResponse } from '@diary-spo/shared'

import { SERVER_URL } from '@config'
import { getCookieFromToken } from '@helpers'
import { HeadersWithCookie } from '@utils'

import { adsGetFromDB, saveAds } from 'src/models/Ads/actions'
import { fetcher } from 'src/utils/fetcher'
import type { WithToken } from '../../types'

type Params = WithToken<{
  spoId: bigint
}>

export const getAds = async ({
  token,
  spoId
}: Params): Promise<NotificationsResponse[]> => {
  const authData = await getCookieFromToken(token)
  const path = `${SERVER_URL}/services/people/organization/news/last/10`
  console.log(path)

  const response = await fetcher.get(path, {
    headers: HeadersWithCookie(authData.cookie)
  })

  if (!response.ok) {
    return adsGetFromDB(spoId)
  }

  const result = await response.json<NotificationsResponse[]>()

  // Попутно сохраняем
  saveAds(result, authData)

  return result
}
