const CACHE_KEYS = [
  'savedMarks',
  'lastMarksFetchTime',
  'savedLessons',
  'lastLessonsFetchTime',
  'savedAds',
  'lastFetchTime',
  'finalMarksData',
  'finalMarksData_time',
  'attestationData',
  'attestationData_time',
  'currentDate',
  'isCurrent',
  'userData'
] as const

export const clearAppCache = (): number => {
  let removed = 0
  for (const key of CACHE_KEYS) {
    try {
      if (localStorage.getItem(key) !== null) {
        localStorage.removeItem(key)
        removed += 1
      }
    } catch {
      // пропускаем недоступные ключи
    }
  }
  return removed
}
