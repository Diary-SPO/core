import { SERVER_URL } from '@config'
import type { NotificationsResponse } from '@diary-spo/shared'
import { ContextWithID } from '@types'
import { HeadersWithCookie } from '@utils'
import { getCookieFromToken } from '../../services/helpers/getCookieFromToken'

const getAds = async ({
  request
}: ContextWithID): Promise<NotificationsResponse | string> => {
  const secret = await getCookieFromToken(request.headers.toJSON().secret)
  const path = `${SERVER_URL}/services/people/organization/news/last/10`
  const response = await fetch(path, {
    headers: HeadersWithCookie(secret)
  })

  return await response.json()
}

export default getAds
