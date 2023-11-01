/**
 * Функция 'formatLessonDate' форматирует переданную дату (в виде строки или объекта Date) в строку,
 * используя длинное представление месяца, числовое представление дня и года.
 * Преобразует входную строку или объект Date в новый объект Date.
 * Затем использует Intl.DateTimeFormatOptions для определения опций форматирования даты,
 * возвращая отформатированную строку, представляющую дату урока.
 */

export const formatLessonDate = (dateString: Date) => {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  return date.toLocaleDateString(undefined, options)
}
