import type { AcademicRecord } from '@diary-spo/shared'
import { getCookieFromToken } from '@helpers'
import { detectTerm } from '@models'
import { ContextWithID } from '@types'
import { getFinalMarksFromDiary, saveFinalMarks } from './service'
import { getFinalMarksFromDB } from './service/get/getFinalMarksFromDB'

const getFinalMarks = async ({
  request
}: ContextWithID): Promise<AcademicRecord | string> => {
  const authData = await getCookieFromToken(request.headers.toJSON().secret)

  const finalMarks = await getFinalMarksFromDiary(authData)

  if (!finalMarks) {
    return await getFinalMarksFromDB(authData)
  }

  // Попутно сохраним "обновление" о семестре
  detectTerm(authData, finalMarks).then(() => {
    saveFinalMarks(finalMarks, authData)
  })

  return finalMarks
}

export default getFinalMarks
