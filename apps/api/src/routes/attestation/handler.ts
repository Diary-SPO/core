import type { AttestationResponse } from '@diary-spo/shared'
import { getCookieFromToken } from '@helpers'
import type { ContextWithID } from '../../types'
import {
  getAttestationFromDB,
  getAttestationFromDiary,
  saveAttestation
} from './service'

const getAttestation = async ({
  request
}: ContextWithID): Promise<AttestationResponse | null> => {
  const authData = await getCookieFromToken(request.headers.toJSON().secret)

  const res = await getAttestationFromDiary(authData)

  if (!res) {
    return getAttestationFromDB(authData)
  }

  saveAttestation(res, authData).catch((e) => console.error(e))

  return res
}

export default getAttestation
