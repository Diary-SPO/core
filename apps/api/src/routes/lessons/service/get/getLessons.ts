import { API_CODES, API_ERRORS, ForbiddenError } from '@api'
import { SERVER_URL } from '@config'
import type { Day } from '@diary-spo/shared'
import type { ICacheData } from '@helpers'
import { HeadersWithCookie } from '@utils'
import ky from 'ky'
import { detectTerm } from 'src/models/Term/actions/other/detectTerm'
import { ScheduleGetFromDB, daySave } from '../../../../models/Schedule'
import { getFormattedResponse } from '../helpers'

export const getLessonsService = async (
  startDate: string,
  endDate: string,
  authData: ICacheData,
  notGetFromDB = false
): Promise<Day[]> => {
  const path = `${SERVER_URL}/services/students/${authData.idFromDiary}/lessons/${startDate}/${endDate}`

  const response = await ky.get(path, {
    headers: HeadersWithCookie(authData.cookie),
    timeout: 10000 // 10 seconds
  })

  if (response.status === API_CODES.FORBIDDEN) {
    throw new ForbiddenError(API_ERRORS.USER_NOT_PERMISSION)
  }

  if (!response.ok && !notGetFromDB) {
    // Получаем из базы
    const rawSchedule = await ScheduleGetFromDB(startDate, endDate, authData)
    return getFormattedResponse(rawSchedule, startDate, endDate, authData)
  }

  // Сохраняем и отдаём
  const days: Day[] = await response.json()
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
