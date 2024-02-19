import { SERVER_URL } from '@config'
import { getCookieFromToken } from '@db'
import type { AttestationResponse } from '@diary-spo/shared'
import { ContextWithID } from '@types'
import { HeadersWithCookie } from '@utils'

const getAttestation = async ({
  request
}: ContextWithID): Promise<AttestationResponse | string> => {
  const authData = await getCookieFromToken(request.headers.toJSON().secret)
  const path = `${SERVER_URL}/services/reports/curator/group-attestation-for-student/${authData.idFromDiary}`
  const response = await fetch(path, {
    headers: HeadersWithCookie(authData.cookie)
  })

  return response.json()
}

export default getAttestation
