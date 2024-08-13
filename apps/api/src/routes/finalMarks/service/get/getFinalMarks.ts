import { SERVER_URL } from '@config'
import type { AcademicRecord } from '@diary-spo/shared'
import type { ICacheData } from '@helpers'
import { HeadersWithCookie } from '@utils'

export const getFinalMarksFromDiary = async (authData: ICacheData) => {
  const path = `${SERVER_URL}/services/students/${authData.idFromDiary}/attestation`

  const response = fetch(path, {
    headers: HeadersWithCookie(authData.cookie)
  })

  return response
    .then(async (r): Promise<AcademicRecord> => r.json())
    .catch(() => null)
}
