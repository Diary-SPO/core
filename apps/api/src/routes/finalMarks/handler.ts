import { SERVER_URL } from '@config'
import { getCookieFromToken } from '@db'
import type { NotificationsResponse } from '@diary-spo/shared'
import { ContextWithID } from '@types'
import { HeadersWithCookie } from '@utils'

const getFinalMarks = async ({
  request
}: ContextWithID): Promise<NotificationsResponse | string> => {
  const authData = await getCookieFromToken(request.headers.toJSON().secret)
  const path = `${SERVER_URL}/services/students/${authData.idFromDiary}/attestation`

  const response = await fetch(path, {
    headers: HeadersWithCookie(authData.cookie)
  })

  return response.json()
}

export default getFinalMarks
