/**
 * Функция 'getTimeRemaining' вычисляет оставшееся время до начала или конца урока на основе предоставленных параметров.
 * Принимает текущую дату и время (currentDate), дату урока (lessonDate), время окончания урока (endTime) и дату начала урока (startDate).
 * Возвращает строку, представляющую оставшееся время до начала или конца урока, или null, если урок уже завершился, еще не начался или до его начала > 1 часа.
 */

export const getTimeRemaining = (
  currentDate: Date,
  lessonDate: Date,
  endTime: string,
  startDate: Date,
): string | null => {
  const endDate = new Date(lessonDate)
  endDate.setHours(Number(endTime.split(':')[0]))
  endDate.setMinutes(Number(endTime.split(':')[1]))
  
  const timeToStart =
    (startDate.getTime() - currentDate.getTime()) / (1000 * 60)
  
  if (timeToStart > 60 || currentDate > endDate) {
    return null
  }
  
  if (currentDate < startDate) {
    return `${Math.floor(timeToStart)} мин до начала`
  }
  
  if (currentDate < endDate) {
    const remainingMinutes =
      (endDate.getTime() - currentDate.getTime()) / (1000 * 60)
    return `${Math.floor(remainingMinutes)} мин до конца`
  }
  
  return null
}
