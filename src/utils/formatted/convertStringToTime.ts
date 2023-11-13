/**
 * Функция 'convertStringToTime' конвертирует строку времени в формате 'hh:mm' в объект типа Date.
 * Принимает строку времени в формате 'hh:mm' (timeString) и базовую дату (baseDate).
 * Возвращает объект Date, представляющий введенное время, или null в случае некорректного формата или значений.
 */

export const convertStringToTime = (
  timeString: string,
  baseDate: Date
): Date | null => {
  const [hours, minutes] = timeString.split(':').map(Number)

  if (
    isNaN(hours) ||
    isNaN(minutes) ||
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
