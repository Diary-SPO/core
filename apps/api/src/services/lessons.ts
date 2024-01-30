import { SERVER_URL } from '@config'
import { Day } from '@diary-spo/shared'
import { DiaryUser } from '@diary-spo/types'
import { HeadersWithCookie } from '@utils'
import { DBSchedule } from '../types/databaseTypes'
import { getDiaryUser } from './tables'
import { saveSchedule } from './tables'
import { removeScheduleForList } from './tables/schedule/remove'

/*
const save = async (days: Day[], userId: number): Promise<void> => {
  const userInfo: DiaryUser | null = await getDiaryUser(userId)

  if (!userInfo) {
    console.error(`Error get info for user: userId=${userId}`)
    return
  }

  // Теперь перебираем каждый день и сохраняем
  for (let i = 0; i < days.length; i++) {
    // Тут храним затронутые пары. Это чтобы потом удалить устаревшие, не затронув актуальные
    const updatingLessons: DBSchedule[] = []

    // Содержатся ли пары для подгрупп (это нужно, чтобы не удалить пары другой подгруппы)
    // false - подгруппы не обнаружены
    // string - наименование подгруппы
    let subgroupExist: boolean | string = false

    const currDay = days[i]
    if (!currDay.lessons) {
      continue
    }

    const currDate = currDay.date.toString().split('T')[0]

    for (let l = 0; l < currDay.lessons?.length; l++) {
      const currLesson = currDay.lessons[l]

      // Сохраняем пару/занятие
      const dbLesson = await saveSchedule(
        currLesson,
        userInfo.groupId,
        currDate
      )

      if (dbLesson) {
        const names = dbLesson.subjectName.split('/')

        if (names.length > 1) {
          subgroupExist = names[1]
        }

        updatingLessons.push(dbLesson)
      }
    }

    if (updatingLessons.length > 0 && userInfo?.groupId) {
      await removeScheduleForList(
        updatingLessons,
        subgroupExist,
        userInfo.groupId,
        currDate
      )
    }
  }
}
*/

export const getLessonsService = async (
  startDate: string,
  endDate: string,
  id: number,
  secret: string
): Promise<Day[] | string> => {
  const path = `${SERVER_URL}/services/students/${id}/lessons/${startDate}/${endDate}`

  const response = await fetch(path, {
    headers: HeadersWithCookie(secret)
  })

  if (!response.ok) {
    // Получаем из базы
    return 'error'
  }

  // Сохраняем и отдаём
  const days: Day[] = await response.json()
  /*save(days, id).catch((err) =>
    console.error(`Ошибка сохранения расписания: ${err}`)
  )*/
  return days
}
