import { SERVER_URL } from '@config'
import type { AcademicRecord } from '@diary-spo/shared'
import type { ICacheData } from '@helpers'
import { HeadersWithCookie } from '@utils'
import { fetcher } from 'src/utils/fetcher'

export const getFinalMarksFromDiary = async (authData: ICacheData) => {
  const path = `${SERVER_URL}/services/students/${authData.idFromDiary}/attestation`

  const response = fetcher.get(path, {
    headers: HeadersWithCookie(authData.cookie)
  })

  return response
    .then(async (r): Promise<AcademicRecord> => r.json())
    .catch(() => null)
}
