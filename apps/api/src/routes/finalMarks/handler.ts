import { SERVER_URL } from '@config'
import type { NotificationsResponse } from '@diary-spo/shared'
import { ContextWithID } from '@types'
import { HeadersWithCookie } from '@utils'
import { getCookieFromToken } from '@db'

const getFinalMarks = async ({
  request,
  params
}: ContextWithID): Promise<NotificationsResponse | string> => {
  const secret = await getCookieFromToken(request.headers.toJSON().secret)
  const { id } = params
  const path = `${SERVER_URL}/services/students/${id}/attestation`

  const response = await fetch(path, {
    headers: HeadersWithCookie(secret)
  })

  return await response.json()
}

export default getFinalMarks
