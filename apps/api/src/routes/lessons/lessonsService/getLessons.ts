import { API_CODES, API_ERRORS, ApiError } from '@api'
import { SERVER_URL } from '@config'
import { Day } from '@diary-spo/shared'
import { ICacheData } from '@helpers'
import { ScheduleGetFromDB, ScheduleSave } from '@models'
import { HeadersWithCookie } from '@utils'

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
    // TODO: fix it
    return ScheduleGetFromDB(
      startDate,
      endDate,
      authData.idFromDiary
    ) as unknown as Day[]
  }

  // Сохраняем и отдаём
  const days: Day[] = await response.json()
  for (const day of days) {
    ScheduleSave(day, authData).catch((err: string) =>
      console.error(`Ошибка сохранения расписания: ${err}`)
    )
  }
  return days
}
