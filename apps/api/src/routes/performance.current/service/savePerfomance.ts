import {
  DayWithMarks,
  DayWithMarksForSubject,
  PerformanceCurrent
} from '@diary-spo/shared'
import { ICacheData } from '@helpers'
import { getPerformanceFromDB } from './getPerformanceFromDB'
import { getLessonsService } from 'src/routes/lessons/lessonsService'

/**
 * Сохраняет оценки в базе
 * @param perfomance
 * @param authData
 */
export const savePerfomance = async (
  performance: PerformanceCurrent,
  authData: ICacheData
) => {
  // Вытягиваем данные из БД, чтобы потом сравнивать
  const dataFromDatabase = await getPerformanceFromDB(authData)
  // Сохраняем даты, для которых нужно провести обновление
  const dayToUpdate: (string | Date)[] = []

  // Сравниваем
  for (const month of performance.daysWithMarksForSubject) {
    if (!month.daysWithMarks) continue
    for (const day of month.daysWithMarks) {
      const actualDate = day.day
      const subjectName = month.subjectName

      // Ищем этот же день для этого же предмета в БД, чтобы сравнить
      const dayFromDB = searchDayFromSubject(
        dataFromDatabase,
        subjectName,
        actualDate
      )

      // Если дня нет в БД, то добавляем в список на добавление/обновление
      if (!dayFromDB) {
        if (dayToUpdate.indexOf(actualDate) == -1) {
          dayToUpdate.push(actualDate)
        }
        continue
      }

      const isEquils = isEquilsPerformanceDays(day, dayFromDB)

      // Если есть отличия, то добавляем в список на добавление/обновление
      if (!isEquils && dayToUpdate.indexOf(actualDate) == -1) {
        dayToUpdate.push(actualDate)
      }
    }
  }

  // Обновляем дял каждого дня
  dayToUpdate.sort((a, b) =>
    new Date(a).getTime() > new Date(b).getTime() ? 1 : -1
  )

  const grouppingDates = groupping(dayToUpdate)

  if (!grouppingDates) return

  // Загружаем расписание по сгруппированным дням (это вызовет автоматическое обновление оценок)
  for (const group of grouppingDates) {
    await getLessonsService(
      String(group.startDate),
      String(group.endDate),
      authData,
      true
    )
  }
}

const searchDayFromSubject = (
  performance: PerformanceCurrent,
  subjectName: string,
  dayToSearch: Date | string
) => {
  for (const month of performance.daysWithMarksForSubject) {
    if (!month.daysWithMarks || month.subjectName != subjectName) continue
    for (const day of month.daysWithMarks) {
      if (day.day == dayToSearch) {
        return day
      }
    }
  }
  return null
}

type countable = {
  [key: string]: number
}

const isEquilsPerformanceDays = (
  dayOne: DayWithMarks,
  dayTwo: DayWithMarks
) => {
  const countableOne = countableDayData(dayOne)
  const countableTwo = countableDayData(dayTwo)

  if (countableOne.absence !== countableTwo.absence) {
    return false
  }

  for (const markType of [...countableOne.types, ...countableTwo.types]) {
    // Если есть отличия, то возвращаем, что не эквивалентны
    if (countableOne.marks[markType] != countableTwo.marks[markType]) {
      return false
    }
  }

  return true
}

const countableDayData = (day: DayWithMarks) => {
  const absence = day.absenceType ?? null
  const marks: countable = {}
  const types: string[] = []

  for (const mark of day.markValues) {
    if (!marks[mark]) {
      marks[mark] = 1
      types.push(mark)
    } else {
      marks[mark] += 1
    }
  }

  return {
    absence,
    marks,
    types
  }
}

/**
 * Группирует даты в один запрос к серверу
 */
const groupping = (dates: (string | Date)[]) => {
  if (!dates.length) return null
  // Количество миллисекунд в дне
  const oneDay = 1000 * 60 * 60 * 24
  // Сгруппированные даты
  const groupDates = []

  for (const day of dates) {
    dates.splice(dates.indexOf(day), 1)
    let endDate = day
    for (const daySearch of dates) {
      const dayDiffMilliseconds =
        new Date(daySearch).getTime() - new Date(day).getTime()
      const dayDiff = Math.round(dayDiffMilliseconds / oneDay)
      if (endDate < daySearch && dayDiff < 14) {
        endDate = daySearch
        dates.splice(dates.indexOf(daySearch), 1)
      }
    }
    groupDates.push({
      startDate: day,
      endDate
    })
  }

  return groupDates
}
