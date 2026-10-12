import { describe, expect, it } from 'bun:test'

import {
  dismissRecommendationPrompt,
  isRecommendationPromptDue,
  postponeRecommendationPrompt
} from '.'

const day = (value: string) => new Date(`${value}T12:00:00`).getTime()

const createStorage = () => {
  const values = new Map<string, string>()

  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value)
  }
}

describe('recommendation prompt', () => {
  it('показывается на третий календарный день', () => {
    expect(
      isRecommendationPromptDue({
        firstVisitAt: day('2026-10-01'),
        hiddenUntil: null,
        now: day('2026-10-03'),
        testMode: false
      })
    ).toBe(true)
  })

  it('не показывается раньше третьего дня', () => {
    expect(
      isRecommendationPromptDue({
        firstVisitAt: day('2026-10-01'),
        hiddenUntil: null,
        now: day('2026-10-02'),
        testMode: false
      })
    ).toBe(false)
  })

  it('учитывает срок скрытия', () => {
    expect(
      isRecommendationPromptDue({
        firstVisitAt: day('2026-10-01'),
        hiddenUntil: day('2026-10-10'),
        now: day('2026-10-03'),
        testMode: false
      })
    ).toBe(false)
  })

  it('в тестовом режиме показывается независимо от сроков', () => {
    expect(
      isRecommendationPromptDue({
        firstVisitAt: day('2026-10-09'),
        hiddenUntil: day('2027-01-09'),
        now: day('2026-10-09'),
        testMode: true
      })
    ).toBe(true)
  })

  it('после обычного закрытия откладывается на пять дней', () => {
    const storage = createStorage()
    const now = day('2026-10-09')

    postponeRecommendationPrompt(now, storage)

    expect(Number(storage.getItem('recommendationPromptHiddenUntil'))).toBe(
      now + 5 * 24 * 60 * 60 * 1000
    )
  })

  it('после отказа скрывается на три месяца', () => {
    const storage = createStorage()
    const now = day('2026-10-09')

    dismissRecommendationPrompt(now, storage)

    expect(Number(storage.getItem('recommendationPromptHiddenUntil'))).toBe(
      day('2027-01-09')
    )
  })

  it('обычное закрытие не сокращает длинный срок скрытия', () => {
    const storage = createStorage()
    const now = day('2026-10-09')

    dismissRecommendationPrompt(now, storage)
    const hiddenUntil = storage.getItem('recommendationPromptHiddenUntil')
    postponeRecommendationPrompt(now, storage)

    expect(storage.getItem('recommendationPromptHiddenUntil')).toBe(hiddenUntil)
  })
})
