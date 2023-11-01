/**
 * Функция 'getTimeRemaining' вычисляет оставшееся время до начала или конца урока на основе предоставленных параметров.
 * Принимает текущую дату и время (currentDate), дату урока (lessonDate), время окончания урока (endTime) и дату начала урока (startDate).
 * Возвращает оставшееся время до начала или конца урока, или null, если урок уже завершился, еще не начался или до его начала > 1 часа.
 */

export const getTimeRemaining = (
  currentDate: Date,
  endTime: Date,
  startDate: Date
): string | null => {
  const timeToStart =
    (startDate.getTime() - currentDate.getTime()) / (1000 * 60)

  if (timeToStart > 60 || currentDate > endTime) {
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

  return null
}
