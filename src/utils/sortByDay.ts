import { IMarksByDay } from '@components'
import { formatDate } from './formatted/formatDate'

/**
 * Функция 'sortByDay' сортирует оценки по дням.
 * Принимает объект 'marksByDay', содержащий оценки, и возвращает объект, отсортированный по дате.
 * Создает массив 'sortedDays' из ключей объекта 'marksByDay', сортируя их по убыванию даты.
 * Затем создает новый объект 'marksByDaySort', копируя значения 'marksByDay' в порядке, отсортированном по дате.
 * Возвращает отсортированный объект 'marksByDaySort' по дням.
 */

export const sortByDay = (marksByDay: IMarksByDay): IMarksByDay => {
  const sortedDays = Object.keys(marksByDay).sort(
    (a, b) => formatDate(b).getTime() - formatDate(a).getTime()
  )

  const marksByDaySort: IMarksByDay = {}
  for (const day of sortedDays) {
    marksByDaySort[day] = marksByDay[day]
  }

  return marksByDaySort
}
