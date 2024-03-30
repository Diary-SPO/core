import { API_CODES, API_ERRORS, ApiError } from '@api'
import { SERVER_URL } from '@config'
import { AcademicRecord } from '@diary-spo/shared'
import { ICacheData } from '@helpers'
import { HeadersWithCookie } from '@utils'

export const getFinalMarksFromDiary = async (authData: ICacheData) => {
  const path = `${SERVER_URL}/services/students/${authData.idFromDiary}/attestation`
  console.log(path)
  const response = fetch(path, {
    headers: HeadersWithCookie(authData.cookie)
  })

  return response
    .then(async (r): Promise<AcademicRecord> => r.json())
    .catch(() => null)
}
