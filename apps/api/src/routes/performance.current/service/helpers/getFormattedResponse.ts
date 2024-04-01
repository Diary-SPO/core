import {
  Grade,
  type MarkKeys,
  type PerformanceCurrent
} from '@diary-spo/shared'
import type { ICacheData } from '@helpers'
import {
  type IDayWithMarks,
  type IMonthWithDay,
  type IPerformanceFromDB,
  monthNames
} from '../types'

export const getFormattedResponse = (
  subjects: IPerformanceFromDB[],
  authData: ICacheData
) => {
  const monthsWithDays: IMonthWithDay[] = []
  const daysWithMarksForSubject = []

  // Формируем daysWithMarksForSubject
  for (const subject of subjects) {
    const subjectName = subject.name
    const daysWithMarks: IDayWithMarks[] = []
    let isIgnored = true
    // Рассчёт оценок
    let sumMarks = 0
    let countMarks = 0

    // Формируем daysWithMarks
    for (const schedule of subject.schedules) {
      // TODO: Очень костыльно убираем чужие подгруппы. Нужно поправить (в будущем)
      const subgroups = schedule.scheduleSubgroups
      if (subgroups.length > 0) {
        for (const subgroup of subgroups) {
          if (subgroup.diaryUserId === authData.localUserId) {
            isIgnored = false
            break
          }
        }
      } else {
        isIgnored = false
      }

      // TODO: относится к костылю выше
      if (isIgnored) {
        break
      }

      const markValues: MarkKeys[] = []
      // Рассчитываем оценки
      for (const task of schedule.tasks) {
        for (const mark of task.marks) {
          const stringMark = mark.markValue.value
          const numberMark = Number(Grade[stringMark])

          if (Number.isNaN(numberMark)) continue

          sumMarks += numberMark
          countMarks++
          markValues.push(stringMark)
        }
      }

      const day = `${schedule.date.toString()}T00:00:00.0000000`

      const absenceType = schedule.absences?.[0]
        ? schedule.absences[0].absenceType.name
        : undefined

      let existDay = null

      for (const dayWithMarks of daysWithMarks) {
        if (dayWithMarks.day === day) {
          existDay = dayWithMarks
          break
        }
      }

      if (existDay) {
        existDay.markValues.push(...markValues)
        continue
      }

      const dayToSave = {
        day,
        absenceType,
        markValues
      }

      // Если нет ни опозданий ни оценок, то не добавлем день в выдачу
      // if (markValues.length || absenceType) {
      daysWithMarks.push(dayToSave)
      // }

      // Добавляем дату в monthsWithDays
      const num = new Date(day).getMonth() + 1
      const name = monthNames[num - 1]

      // Ищем, есть ли уже месяц в массиве
      let currMonthWithDays = null

      for (const month of monthsWithDays) {
        if (month.month.num === num) {
          // Ищем, есть ли уже день в месяце
          let isExist = false
          for (const dayCheck of month.daysWithLessons) {
            if (dayCheck === day) {
              isExist = true
              break
            }
          }
          if (!isExist) {
            month.daysWithLessons.push(day)
          }
          currMonthWithDays = month
          break
        }
      }

      if (currMonthWithDays) continue

      monthsWithDays.push({
        month: {
          num,
          name
        },
        daysWithLessons: [day]
      })
    }

    // TODO: относится к костылю выше
    if (isIgnored) {
      continue
    }

    // Выполняем сортировку всех дат и месяцев
    daysWithMarks.sort((a, b) =>
      new Date(a.day).getTime() > new Date(b.day).getTime() ? 1 : -1
    )
    monthsWithDays.sort((a, b) => (a.month.num > b.month.num ? 1 : -1))
    for (const v of monthsWithDays) {
      v.daysWithLessons.sort((a, b) =>
        new Date(a).getTime() > new Date(b).getTime() ? 1 : -1
      )
    }

    // undefined не будет генерировать поле в ответе
    const averageMark =
      countMarks > 0 ? (sumMarks / countMarks).toFixed(2) : undefined

    daysWithMarksForSubject.push({
      subjectName,
      daysWithMarks,
      averageMark
    })
  }

  return {
    monthsWithDays,
    daysWithMarksForSubject
  } as PerformanceCurrent
}
