import type { AcademicRecord } from '@diary-spo/shared'
import { getCookieFromToken } from '@helpers'
import { ContextWithID } from '@types'
import { detectTerm } from 'src/models/Term/actions/detectTerm'
import { getFinalMarksFromDiary } from './service'

const getFinalMarks = async ({
  request
}: ContextWithID): Promise<AcademicRecord | string> => {
  const authData = await getCookieFromToken(request.headers.toJSON().secret)

  const finalMarks = await getFinalMarksFromDiary(authData)

  // Попутно сохраним "обновление" о семестре
  detectTerm(authData, finalMarks)

  return finalMarks
}

export default getFinalMarks
