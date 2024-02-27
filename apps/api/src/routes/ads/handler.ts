import { SERVER_URL } from '@config'
import { getCookieFromToken } from '@helpers'
import type { NotificationsResponse } from '@diary-spo/shared'
import { ContextWithID } from '@types'
import { HeadersWithCookie } from '@utils'

const getAds = async ({
  request
}: ContextWithID): Promise<NotificationsResponse | string> => {
  const authData = await getCookieFromToken(request.headers.toJSON().secret)
  const path = `${SERVER_URL}/services/people/organization/news/last/10`
  const response = await fetch(path, {
    headers: HeadersWithCookie(authData.cookie)
  })

  return await response.json()
}

export default getAds
