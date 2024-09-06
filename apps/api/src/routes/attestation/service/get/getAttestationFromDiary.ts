import type { AttestationResponse } from '@diary-spo/shared'

import { SERVER_URL } from '@config'
import type { ICacheData } from '@helpers'
import { HeadersWithCookie } from '@utils'
import ky from 'ky'

export const getAttestationFromDiary = async (
  authData: ICacheData
): Promise<AttestationResponse> => {
  const path = `${SERVER_URL}/services/reports/curator/group-attestation-for-student/${authData.idFromDiary}`

  return ky
    .get(path, {
      headers: HeadersWithCookie(authData.cookie),
      timeout: 10000 // 10 seconds
    })
    .json()
}
