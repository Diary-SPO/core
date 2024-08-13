import type { DayWithMarks, PerformanceCurrent } from '@diary-spo/shared'
import type { ICacheData } from '@helpers'
import { getLessonsService } from 'src/routes/lessons/service'
import { getPerformanceFromDB } from '../get'

// разделить на разные файлы

/**
 * Сохраняет оценки в базе
 */
export const savePerformance = async (
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
        if (dayToUpdate.indexOf(actualDate) === -1) {
          dayToUpdate.push(actualDate)
        }
        continue
      }

      const isEqual = isEqualsPerformanceDays(day, dayFromDB)

      // Если есть отличия, то добавляем в список на добавление/обновление
      if (!isEqual && dayToUpdate.indexOf(actualDate) === -1) {
        dayToUpdate.push(actualDate)
      }
    }
  }

  // Обновляем для каждого дня
  dayToUpdate.sort((a, b) =>
    new Date(a).getTime() > new Date(b).getTime() ? 1 : -1
  )

  const groupedDates = getGroupedDates(dayToUpdate)

  if (!groupedDates) return

  // Загружаем расписание по сгруппированным дням (это вызовет автоматическое обновление оценок)
  for (const group of groupedDates) {
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
    if (!month.daysWithMarks || month.subjectName !== subjectName) continue
    for (const day of month.daysWithMarks) {
      if (day.day === dayToSearch) {
        return day
      }
    }
  }
  return null
}

type countable = {
  [key: string]: number
}

const isEqualsPerformanceDays = (
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
    if (countableOne.marks[markType] !== countableTwo.marks[markType]) {
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
const getGroupedDates = (dates: (string | Date)[]) => {
  if (!dates.length) return null
  // Количество миллисекунд в дне
  const oneDay = 1000 * 60 * 60 * 24
  // Сгруппированные даты
  const groupDates = []

  // const day of dates
  for (let i = 0; i < dates.length; i++) {
    const day = dates[i]
    dates.splice(dates.indexOf(day), 1)
    i--
    let endDate = day
    //const daySearch of dates
    for (let j = 0; j < dates.length; j++) {
      const daySearch = dates[j]
      const dayDiffMilliseconds =
        new Date(daySearch).getTime() - new Date(day).getTime()
      const dayDiff = Math.round(dayDiffMilliseconds / oneDay)
      if (endDate < daySearch && dayDiff < 14) {
        endDate = daySearch
        dates.splice(dates.indexOf(daySearch), 1)
        j--
      }
    }

    groupDates.push({
      startDate: day,
      endDate
    })
  }

  return groupDates
}
