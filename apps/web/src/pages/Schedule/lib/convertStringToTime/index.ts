import type { Nullable } from '@diary-spo/shared'

/**
 * Функция 'convertStringToTime' конвертирует строку времени в формате 'hh:mm' в объект типа Date.
 * Принимает строку времени в формате 'hh:mm' (timeString) и базовую дату (baseDate).
 * Возвращает объект Date, представляющий введенное время, или null в случае некорректного формата или значений.
 */
export const convertStringToTime = (
  timeString: string,
  baseDate: Nullable<Date>
): Nullable<Date> => {
  const [hours, minutes] = timeString.split(':').map(Number)

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null
  }

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null
  }

  if (!baseDate) {
    return null
  }

  const newDate = new Date(baseDate)
  newDate.setHours(hours)
  newDate.setMinutes(minutes)

  return newDate
}
