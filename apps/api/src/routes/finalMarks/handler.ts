import type { AcademicRecord } from '@diary-spo/shared'

import { getCookieFromToken } from '@helpers'
import { getFinalMarksFromDiary, saveFinalMarks } from './service'
import { getFinalMarksFromDB } from './service/get/getFinalMarksFromDB'
import { structurizeResponse } from './service/other'

import { detectTerm } from '../../models/Term'
import type { Token } from '../../types'

type Params = Token

const getFinalMarks = async ({
  token
}: Params): Promise<AcademicRecord | string> => {
  const authData = await getCookieFromToken(token)

  const finalMarks = await getFinalMarksFromDiary(authData)

  if (!finalMarks) {
    const dataFromDB = await getFinalMarksFromDB(authData)
    return structurizeResponse(dataFromDB, authData)
  }

  // Попутно сохраним "обновление" о семестре
  detectTerm(authData, finalMarks).then(() => {
    saveFinalMarks(finalMarks, authData)
  })

  return finalMarks
}

export default getFinalMarks
