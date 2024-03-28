import type { AttestationResponse } from '@diary-spo/shared'
import { getCookieFromToken } from '@helpers'
import { ContextWithID } from '@types'
import {
  getAttestationFromDiary,
  saveAttestation,
  getAttestationFromDB
} from './service'

const getAttestation = async ({
  request
}: ContextWithID): Promise<AttestationResponse | string> => {
  const authData = await getCookieFromToken(request.headers.toJSON().secret)

  const res = await getAttestationFromDiary(authData)

  if (!res) {
    return await getAttestationFromDB(authData)
    //throw new ApiError(API_ERRORS.DATA_NOT_FOUND, API_CODES.UNKNOWN_ERROR)
  }

  saveAttestation(res, authData).catch((e) => console.error(e))

  return res
}

export default getAttestation
