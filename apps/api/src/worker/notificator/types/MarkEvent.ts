import type { MarkKeys, Task } from '@diary-spo/shared'

export interface MarkEvent {
  diaryUserId: bigint
  task: Task
  mark: MarkKeys
  previousMarkId: number | null
  status: 'ADD' | 'DELETE' | 'UPDATE'
  eventDatetime: Date
}
