/**
 * Функция 'convertStringToTime' конвертирует строку времени в формате 'hh:mm' в объект типа Date.
 * Принимает строку времени в формате 'hh:mm' (timeString) и базовую дату (baseDate).
 * Возвращает объект Date, представляющий введенное время, или null в случае некорректного формата или значений.
 */
import { Nullable } from '@diary-spo/shared'

export const convertStringToTime = (
  timeString: string,
  baseDate: Date
): Nullable<Date> => {
  const [hours, minutes] = timeString.split(':').map(Number)

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null
  }

  const newDate = new Date(baseDate)
  newDate.setHours(hours)
  newDate.setMinutes(minutes)

  return newDate
}

/**
 * Функция 'getTimeRemaining' вычисляет оставшееся время до начала или конца урока на основе предоставленных параметров.
 * Принимает текущую дату и время (currentDate), дату урока (lessonDate), время окончания урока (endTime) и дату начала урока (startDate).
 * Возвращает оставшееся время до начала или конца урока, или null, если урок уже завершился, еще не начался или до его начала > 1 часа.
 */

export const getTimeRemaining = (
  currentDate: Date,
  endTime: Date,
  startDate: Date
): Nullable<string> => {
  const timeToStart =
    (startDate.getTime() - currentDate.getTime()) / (1000 * 60)

  if (timeToStart > 90 || currentDate > endTime) {
    return null
  }

  if (currentDate < startDate) {
    return `${Math.floor(timeToStart)} мин до начала`
  }

  if (currentDate < endTime) {
    const remainingMinutes =
      (endTime.getTime() - currentDate.getTime()) / (1000 * 60)
    return `${Math.floor(remainingMinutes)} мин до конца`
  }
}
