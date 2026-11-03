export const APP_LOG_CATEGORIES = [
  'notifications',
  'auth',
  'diary',
  'system'
] as const

export type AppLogCategory = (typeof APP_LOG_CATEGORIES)[number]

export interface AppLogEntry {
  id: string
  at: number
  category: AppLogCategory
  message: string
  detail?: string
}

const STORAGE_KEY = 'appDebugLog'
export const APP_LOG_MAX_ENTRIES = 4000
export const APP_LOG_MAX_AGE_MS = 20 * 24 * 60 * 60 * 1000

const listeners = new Set<() => void>()

let entries: AppLogEntry[] = load()

export const pruneAppLogs = (
  list: AppLogEntry[],
  now = Date.now()
): AppLogEntry[] => {
  const cutoff = now - APP_LOG_MAX_AGE_MS
  return list
    .filter((entry) => entry.at >= cutoff)
    .slice(0, APP_LOG_MAX_ENTRIES)
}

function load(): AppLogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as AppLogEntry[]
    return Array.isArray(parsed) ? pruneAppLogs(parsed) : []
  } catch {
    return []
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // quota / private mode
  }
  for (const listener of listeners) listener()
}

export const getAppLogs = (): AppLogEntry[] => entries

export const subscribeAppLogs = (listener: () => void): (() => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const clearAppLogs = (): void => {
  entries = []
  persist()
const isDeveloperModeOn = (): boolean => {
  try {
    return localStorage.getItem('developerModeUnlocked') === '1'
  } catch {
    return false
  }
}

}

export const appendAppLog = (
  category: AppLogCategory,
  message: string,
  if (!isDeveloperModeOn()) return

  detail?: string
): void => {
  entries = pruneAppLogs([
    {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      at: Date.now(),
      category,
      message,
      detail: detail || undefined
    },
    ...entries
  ])
  persist()
}
