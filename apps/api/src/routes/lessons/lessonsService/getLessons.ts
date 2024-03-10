import { API_CODES, API_ERRORS, ApiError } from '@api'
import { SERVER_URL } from '@config'
import { Day } from '@diary-spo/shared'
import { ICacheData } from '@helpers'
import { ScheduleGetFromDB, daySave } from '@models'
import { HeadersWithCookie } from '@utils'
import { detectTerm } from 'src/models/Term/actions/detectTerm'

export const getLessonsService = async (
  startDate: string,
  endDate: string,
  authData: ICacheData
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
    return ScheduleGetFromDB(
      startDate,
      endDate,
      authData.idFromDiary
    ) as unknown as Day[]
  }

  // Сохраняем и отдаём
  const days: Day[] = await response.json()
  const term = detectTerm(authData)
  for (const day of days) {
    daySave(day, authData, term).catch((err: string) =>
      console.error(`Ошибка сохранения расписания: ${err}`)
    )
  }
  return days
}
