import { SERVER_URL } from '@config'
import type { NotificationsResponse } from '@diary-spo/shared'
import { getCookieFromToken } from '@helpers'
import { ContextWithID } from '@types'
import { HeadersWithCookie } from '@utils'
import { saveAds } from 'src/models/Ads/actions'
import { adsGetFromDB } from '@models'

const getAds = async ({
  request
}: ContextWithID): Promise<NotificationsResponse | string> => {
  const authData = await getCookieFromToken(request.headers.toJSON().secret)
  const path = `${SERVER_URL}/services/people/organization/news/last/10`
  const response = await fetch(path, {
    headers: HeadersWithCookie(authData.cookie)
  })

  if (!response.ok) {
    return JSON.stringify(await adsGetFromDB(authData), null, 2)
  }

  const result = await response.json()

  // Попутно сохраняем
  saveAds(result, authData)

  return result
}

export default getAds
