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
    day: 'numeric',
  }

  return date.toLocaleDateString(undefined, options)
}

/**
 * Функция 'getDayOfWeek' возвращает сокращенное представление дня недели (например, 'Пн', 'Вт') на основе переданной даты.
 * Использует массив 'daysOfWeek', содержащий сокращенные названия дней недели.
 * Возвращает сокращенное название дня недели на основе индекса, полученного из переданного объекта Date.
 */

export const getDayOfWeek = (date: Date) => {
  const daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
  return daysOfWeek[date.getDay()]
}
