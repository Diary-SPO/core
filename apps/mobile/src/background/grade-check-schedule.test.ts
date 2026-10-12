import { describe, expect, test } from 'bun:test'

import {
  getGradeCheckInterval,
  shouldRunGradeCheck
} from './grade-check-schedule.ts'

describe('background grade check schedule', () => {
  test('uses the configured interval during daytime', () => {
    expect(getGradeCheckInterval(new Date(2026, 8, 7, 6), 30)).toBe(30)
    expect(getGradeCheckInterval(new Date(2026, 8, 7, 19, 59), 15)).toBe(15)
  })

  test('checks no more than once per two hours at night', () => {
    expect(getGradeCheckInterval(new Date(2026, 8, 7, 20), 15)).toBe(120)
    expect(getGradeCheckInterval(new Date(2026, 8, 8, 5, 59), 60)).toBe(120)
  })

  test('runs only after the effective interval', () => {
    const now = new Date(2026, 8, 7, 20)
    expect(shouldRunGradeCheck(now, now.getTime() - 119 * 60_000, 30)).toBe(
      false
    )
    expect(shouldRunGradeCheck(now, now.getTime() - 120 * 60_000, 30)).toBe(
      true
    )
  })
})
