import { SERVER_URL } from '@config'
import type { AcademicRecord } from '@diary-spo/shared'
import type { ICacheData } from '@helpers'
import { HeadersWithCookie } from '@utils'
import ky from 'ky'

export const getFinalMarksFromDiary = async (authData: ICacheData) => {
  const path = `${SERVER_URL}/services/students/${authData.idFromDiary}/attestation`

  const response = ky.get(path, {
    headers: HeadersWithCookie(authData.cookie),
    timeout: 10000 // 10 seconds
  })

  return response
    .then(async (r): Promise<AcademicRecord> => r.json())
    .catch(() => null)
}
