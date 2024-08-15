import { describe, expect, it } from 'bun:test'
import { isToday } from '../index.ts'

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
