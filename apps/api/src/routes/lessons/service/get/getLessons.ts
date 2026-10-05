import { API_CODES, API_ERRORS, ForbiddenError } from '@api'
import { DiaryClientError } from '@diary-spo/diary-client'
import type { Day } from '@diary-spo/shared'
import type { ICacheData } from '@helpers'
import { detectTerm } from 'src/models/Term/actions/other/detectTerm'
import { createDiaryClient } from 'src/services/DiaryClientService'
import { ScheduleGetFromDB, daySave } from '../../../../models/Schedule'
import { getFormattedResponse } from '../helpers'

export const getLessonsService = async (
  startDate: string,
  endDate: string,
  authData: ICacheData,
  notGetFromDB = false
): Promise<Day[]> => {
  let days: Day[]
  try {
    days = await createDiaryClient(authData).getLessons(startDate, endDate)
  } catch (error) {
    if (
      error instanceof DiaryClientError &&
      error.status === API_CODES.FORBIDDEN
    ) {
      throw new ForbiddenError(API_ERRORS.USER_NOT_PERMISSION)
    }

    if (notGetFromDB) throw error

    const rawSchedule = await ScheduleGetFromDB(startDate, endDate, authData)
    return getFormattedResponse(rawSchedule, startDate, endDate, authData)
  }

  const term = detectTerm(authData)

  for (const day of days) {
    const backgroundProcess = async () =>
      daySave(day, authData, term).catch((err: string) =>
        console.error(`Ошибка сохранения расписания: ${err}`)
      )

    if (notGetFromDB) {
      await backgroundProcess()
    } else {
      backgroundProcess()
    }
  }

  return days
}
