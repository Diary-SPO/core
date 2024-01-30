import { describe, expect, it } from 'bun:test'
import { formatLessonDate, isToday } from '../helpers.ts'

/** isToday **/
describe('isToday', () => {
  it('должна вернуть true для сегодняшней даты', () => {
    const today = new Date()
    const isTodayTrue = isToday(today)

    expect(isTodayTrue).toBe(true)
  })

  it('должна вернуть false не для сегодняшней даты', () => {
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
    const isTodayFalse = isToday(yesterday)

    expect(isTodayFalse).toBe(false)
  })
})

/** formatLessonDate **/
it('должна правильно форматировать дату урока', () => {
  const date = new Date(2023, 10, 1)
  const result = formatLessonDate(date)
  expect(result).toBe('1 ноября 2023 г.')
})
