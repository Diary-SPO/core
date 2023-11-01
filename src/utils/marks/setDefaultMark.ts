import { Grade, Task, TextMark } from 'diary-shared'

export type ReturnedMark = TextMark | 'Н' | 'ДЗ' | 'О' | 'Д' | number

/**
 * Функция 'setDefaultMark' устанавливает значение оценки по умолчанию на основе задачи.
 * Принимает объект задачи (task) и определяет значение оценки по различным критериям:
 *   - Если задача обязательна и оценка отсутствует, возвращает 'Д' - Долг (не выполнено).
 *   - Если тип задачи 'Home' (домашнее задание) и оценка отсутствует, возвращает 'ДЗ'.
 *   - Иначе возвращает оценку, соответствующую значению задачи из списка Grade.
 */

export const setDefaultMark = (task: Task): ReturnedMark => {
  if (task.isRequired && !task.mark) {
    return 'Д'
  }

  if (task.type === 'Home' && !task.mark) {
    return 'ДЗ'
  }

  return Grade[task.mark]
}
