import { beforeEach, describe, expect, test } from 'bun:test'

import {
  APP_LOG_MAX_AGE_MS,
  APP_LOG_MAX_ENTRIES,
  appendAppLog,
  clearAppLogs,
  getAppLogs,
  pruneAppLogs,
  subscribeAppLogs
} from './index.ts'

const installFakeStorage = () => {
  const values = new Map<string, string>()
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    writable: true,
    value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => {
        values.set(key, value)
      },
      removeItem: (key: string) => {
        values.delete(key)
      }
    }
  })
}

describe('appLog', () => {
  beforeEach(() => {
    installFakeStorage()
    clearAppLogs()
  })

  test('prepends entries and notifies subscribers', () => {
    let ticks = 0
    const stop = subscribeAppLogs(() => {
      ticks += 1
    })

    appendAppLog('auth', 'login ok')
    appendAppLog('diary', 'GET /x', '401')

    expect(getAppLogs().map((entry) => entry.message)).toEqual([
      'GET /x',
      'login ok'
    ])
    expect(ticks).toBeGreaterThanOrEqual(2)
    stop()
  })

  test('drops entries older than 20 days and caps at 4k', () => {
    const now = Date.UTC(2026, 10, 3)
    const fresh = {
      id: '1',
      at: now - 1000,
      category: 'system' as const,
      message: 'fresh'
    }
    const stale = {
      id: '2',
      at: now - APP_LOG_MAX_AGE_MS - 1,
      category: 'system' as const,
      message: 'stale'
    }
    const many = Array.from({ length: APP_LOG_MAX_ENTRIES + 5 }, (_, i) => ({
      id: String(i),
      at: now - i,
      category: 'diary' as const,
      message: `m${i}`
    }))

    expect(pruneAppLogs([fresh, stale], now)).toEqual([fresh])
    expect(pruneAppLogs(many, now)).toHaveLength(APP_LOG_MAX_ENTRIES)
  })
})
