import type { MarkKeys, Task } from '@diary-spo/shared'

export interface IMarkEvent {
  diaryUserId: bigint
  task: Task
  mark: MarkKeys
  previousMarkId: number | null
  status: 'ADD' | 'DELETE' | 'UPDATE'
  eventDatetime: Date
}

const ids_marks: IMarkEvent[] = [] // Идентификаторы оценок

/**
 * Регистрирует событие взаимодействия с оценкой
 * @param event
 */
export const addNewMarkEvent = (event: IMarkEvent): void => {
  ids_marks.push(event)
  console.log(event)
}

export const getMarkEvent = () =>
  ids_marks.length > 0 ? ids_marks.splice(0, 1)[0] : null
