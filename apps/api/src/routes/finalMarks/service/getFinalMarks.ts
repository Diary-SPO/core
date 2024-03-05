import { API_CODES, API_ERRORS, ApiError } from '@api'
import { SERVER_URL } from '@config'
import { AcademicRecord } from '@diary-spo/shared'
import { ICacheData } from '@helpers'
import { HeadersWithCookie } from '@utils'

export const getFinalMarksFromDiary = async (authData: ICacheData) => {
  const path = `${SERVER_URL}/services/students/${authData.idFromDiary}/attestation`
  const response = fetch(path, {
    headers: HeadersWithCookie(authData.cookie)
  })

  return response
    .then(async (r) => r.json() as unknown as AcademicRecord)
    .catch(() => {
      throw new ApiError(API_ERRORS.DATA_NOT_FOUND, API_CODES.UNKNOWN_ERROR)
    })
}