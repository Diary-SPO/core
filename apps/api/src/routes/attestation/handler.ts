import { SERVER_URL } from '@config'
import { getCookieFromToken } from '@db'
import type { AttestationResponse } from '@diary-spo/shared'
import { ContextWithID } from '@types'
import { HeadersWithCookie } from '@utils'

const getAttestation = async ({
  request,
  params
}: ContextWithID): Promise<AttestationResponse | string> => {
  const { id } = params
  const secret = await getCookieFromToken(request.headers.toJSON().secret)
  const path = `${SERVER_URL}/services/reports/curator/group-attestation-for-student/${id}`
  const response = await fetch(path, {
    headers: HeadersWithCookie(secret)
  })

  return response.json()
}

export default getAttestation
