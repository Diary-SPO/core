import type { AcademicRecord } from '@diary-spo/shared'
import { getCookieFromToken } from '@helpers'
import { ContextWithID } from '@types'
import { getFinalMarksFromDiary } from 'src/ApiOriginal'

const getFinalMarks = async ({
  request
}: ContextWithID): Promise<AcademicRecord | string> => {
  const authData = await getCookieFromToken(request.headers.toJSON().secret)

  return await getFinalMarksFromDiary(authData)
}

export default getFinalMarks
