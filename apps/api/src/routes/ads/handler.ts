import { SERVER_URL } from '@config'
import type { NotificationsResponse } from '@diary-spo/shared'
import { getCookieFromToken } from '@helpers'
import type { ContextWithID } from '@types'
import { HeadersWithCookie } from '@utils'
import { adsGetFromDB, saveAds } from 'src/models/Ads/actions'

const getAds = async ({
  request
}: ContextWithID): Promise<NotificationsResponse> => {
  const authData = await getCookieFromToken(request.headers.toJSON().secret)
  const path = `${SERVER_URL}/services/people/organization/news/last/10`
  console.log(path)
  const response = await fetch(path, {
    headers: HeadersWithCookie(authData.cookie)
  })

  if (!response.ok) {
    return adsGetFromDB(authData)
  }

  const result = await response.json()

  // Попутно сохраняем
  saveAds(result, authData)

  return result
}

export default getAds
