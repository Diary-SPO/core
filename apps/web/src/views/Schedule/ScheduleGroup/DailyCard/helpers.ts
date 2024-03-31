/**
 * Функция 'isToday' проверяет, является ли переданная дата сегодняшней датой.
 * Принимает объект типа Date и сравнивает его с текущей датой.
 * Сравнивает день, месяц и год переданной даты с соответствующими значениями текущей даты.
 * Возвращает булево значение: true, если переданная дата соответствует сегодняшней дате, иначе - false.
 */

export const isToday = (date: Date) => {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

/**
 * Функция 'formatLessonDate' форматирует переданную дату (в виде строки или объекта Date) в строку,
 * используя длинное представление месяца, числовое представление дня и года.
 * Преобразует входную строку или объект Date в новый объект Date.
 * Затем использует Intl.DateTimeFormatOptions для определения опций форматирования даты,
 * возвращая отформатированную строку, представляющую дату урока.
 */

export const formatLessonDate = (dateString: Date | string) => {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  return date.toLocaleDateString('ru-RU', options)
}
