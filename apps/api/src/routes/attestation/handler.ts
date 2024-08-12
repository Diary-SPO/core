import type { AttestationResponse } from '@diary-spo/shared'
import { getCookieFromToken } from '@helpers'
import type { Token } from '../../types'
import {
  getAttestationFromDB,
  getAttestationFromDiary,
  saveAttestation
} from './service'

type Params = Token

const getAttestation = async ({
  token
}: Params): Promise<AttestationResponse | null> => {
  const authData = await getCookieFromToken(token)

  const res = await getAttestationFromDiary(authData)

  if (!res) {
    return getAttestationFromDB(authData)
  }

  saveAttestation(res, authData).catch((e) => console.error(e))

  return res
}

export default getAttestation
