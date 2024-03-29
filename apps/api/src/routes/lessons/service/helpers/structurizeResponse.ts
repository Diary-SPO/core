import { Day, Lesson, Task, Timetable } from '@diary-spo/shared'
import { ICacheData } from '@helpers'
import { ScheduleFromDB } from '@models'
import { formatDate } from '@utils'
import { structurizeGradebook } from './structurizeGradebook'
import { structurizeTimetable } from './structurizeTimetable'

export const structurizeResponse = (
  raw: ScheduleFromDB[],
  startDate: string,
  endDate: string,
  authData: ICacheData
) => {
  const Days: Day[] = []

  // Подготавливаем даты
  const sd = new Date(startDate)
  const ed = new Date(endDate)
  const dates = []
  while (formatDate(sd) <= formatDate(ed)) {
    dates.push(formatDate(sd))
    sd.setDate(sd.getDate() + 1)
  }

  // Подготавливаем каждый день (rd - raw day)
  for (const date of dates) {
    const lessons: Lesson[] = []
    for (const rd of raw) {
      if (rd.date !== date) continue
      if (rd.scheduleSubgroups.length) {
        let meSubgroup = false
        for (const subgroup of rd.scheduleSubgroups) {
          if (subgroup.diaryUserId === authData.localUserId) {
            meSubgroup = true
            break
          }
        }
        if (!meSubgroup) continue
      }

      // Сам lesson
      const { endTime, startTime } = rd
      const name = rd.subject.name

      // Градебук
      const gradebook = structurizeGradebook(rd)

      //Подготавливаем timetable
      const timetable = structurizeTimetable(rd)

      const lesson: Lesson = {
        endTime,
        startTime,
        name,
        gradebook,
        timetable
      }

      lessons.push(lesson)
    }
    // Сортируем lessons
    lessons.sort((a, b) => (a.startTime > b.startTime ? 1 : -1))

    Days.push({
      date,
      lessons
    })
  }

  // Сортируем дни
  Days.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return Days
}
