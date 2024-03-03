import type { AttestationResponse } from '@diary-spo/shared'
import { getCookieFromToken } from '@helpers'
import { ContextWithID } from '@types'
import { getAttestationFromDiary } from 'src/ApiOriginal'

const getAttestation = async ({
  request
}: ContextWithID): Promise<AttestationResponse | string> => {
  const authData = await getCookieFromToken(request.headers.toJSON().secret)

  return await getAttestationFromDiary(authData)
}

export default getAttestation
