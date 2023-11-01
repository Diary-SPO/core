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
