import { beforeEach, describe, expect, test } from 'bun:test'

import { clearAuthData, hasAuthData } from '../index.ts'

const installFakeStorage = (seed: Record<string, string> = {}) => {
  const values = new Map(Object.entries(seed))
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
  return values
}

describe('session storage', () => {
  beforeEach(() => {
    installFakeStorage({
      id: '7',
      token: 'direct-session',
      data: '{}',
      directDiaryCookies: 'UID=1',
      diaryUrl: 'https://poo.tomedu.ru',
      themePreference: 'dark'
    })
  })

  test('сносит только авторизацию, регион и настройки целы', () => {
    expect(hasAuthData()).toBe(true)
    clearAuthData()
    expect(hasAuthData()).toBe(false)
    expect(localStorage.getItem('diaryUrl')).toBe('https://poo.tomedu.ru')
    expect(localStorage.getItem('themePreference')).toBe('dark')
  })
})
