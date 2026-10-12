import { RECOMMENDATION_PROMPT_TEST_MODE } from '../../config'

const DAY_MS = 24 * 60 * 60 * 1000
const FIRST_VISIT_STORAGE_KEY = 'recommendationPromptFirstVisitAt'
const HIDDEN_UNTIL_STORAGE_KEY = 'recommendationPromptHiddenUntil'

type PromptStorage = Pick<Storage, 'getItem' | 'setItem'>

const readTimestamp = (storage: PromptStorage, key: string): number | null => {
  const value = Number(storage.getItem(key))
  return Number.isFinite(value) && value > 0 ? value : null
}

const calendarDayNumber = (timestamp: number): number => {
  const date = new Date(timestamp)
  return Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS
  )
}

export const isRecommendationPromptDue = ({
  firstVisitAt,
  hiddenUntil,
  now,
  testMode = RECOMMENDATION_PROMPT_TEST_MODE
}: {
  firstVisitAt: number
  hiddenUntil: number | null
  now: number
  testMode?: boolean
}): boolean => {
  if (testMode) return true
  if (hiddenUntil && hiddenUntil > now) return false

  return calendarDayNumber(now) - calendarDayNumber(firstVisitAt) >= 2
}

export const shouldShowRecommendationPrompt = (
  now = Date.now(),
  storage: PromptStorage = localStorage
): boolean => {
  let firstVisitAt = readTimestamp(storage, FIRST_VISIT_STORAGE_KEY)

  if (!firstVisitAt) {
    firstVisitAt = now
    storage.setItem(FIRST_VISIT_STORAGE_KEY, String(firstVisitAt))
  }

  return isRecommendationPromptDue({
    firstVisitAt,
    hiddenUntil: readTimestamp(storage, HIDDEN_UNTIL_STORAGE_KEY),
    now
  })
}

const hideUntil = (
  timestamp: number,
  storage: PromptStorage = localStorage
) => {
  const currentValue = readTimestamp(storage, HIDDEN_UNTIL_STORAGE_KEY) ?? 0
  storage.setItem(
    HIDDEN_UNTIL_STORAGE_KEY,
    String(Math.max(timestamp, currentValue))
  )
}

export const postponeRecommendationPrompt = (
  now = Date.now(),
  storage: PromptStorage = localStorage
) => hideUntil(now + 5 * DAY_MS, storage)

export const dismissRecommendationPrompt = (
  now = Date.now(),
  storage: PromptStorage = localStorage
) => {
  const hiddenUntil = new Date(now)
  hiddenUntil.setMonth(hiddenUntil.getMonth() + 3)
  hideUntil(hiddenUntil.getTime(), storage)
}
