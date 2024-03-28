import { API_CODES, API_ERRORS, ApiError } from '@api'
import { SERVER_URL } from '@config'
import { Day } from '@diary-spo/shared'
import { ICacheData } from '@helpers'
import { ScheduleGetFromDB, daySave } from '@models'
import { HeadersWithCookie } from '@utils'
import { detectTerm } from 'src/models/Term/actions/other/detectTerm'
import { structurizeResponse } from '../helpers'

export const getLessonsService = async (
  startDate: string,
  endDate: string,
  authData: ICacheData,
  isAwait = false
): Promise<Day[] | string> => {
  const path = `${SERVER_URL}/services/students/${authData.idFromDiary}/lessons/${startDate}/${endDate}`

  const response = await fetch(path, {
    headers: HeadersWithCookie(authData.cookie)
  })

  if (response.status === API_CODES.FORBIDDEN) {
    throw new ApiError(API_ERRORS.USER_NOT_PERMISSION, API_CODES.FORBIDDEN)
  }

  if (!response.ok) {
    // Получаем из базы
    const rawSchedule = await ScheduleGetFromDB(
      startDate,
      endDate,
      authData
    )
    return structurizeResponse(rawSchedule, startDate, endDate, authData)
  }

  // Сохраняем и отдаём
  const days: Day[] = await response.json()
  const term = detectTerm(authData)
  for (const day of days) {
    const backgroundProcess = async () =>
      daySave(day, authData, term).catch((err: string) =>
        console.error(`Ошибка сохранения расписания: ${err}`)
      )

    if (isAwait) {
      await backgroundProcess()
    } else {
      backgroundProcess()
    }
  }
  return days
}
