import { expect, it } from 'bun:test'
import { formatLessonDate } from '../index.ts'

/** formatLessonDate **/
it('должна правильно форматировать дату урока', () => {
  const date = new Date(2023, 10, 1)
  const result = formatLessonDate(date)
  expect(result).toBe('1 ноября 2023 г.')
})
