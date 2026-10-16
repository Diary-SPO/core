import { describe, expect, test } from 'bun:test'

import {
  bumpLoginFailCount,
  readLoginFailCount,
  resetLoginFailCount
} from '../failCounter'
import { buildSupportReport } from '../support'

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

describe('failCounter', () => {
  test('считает подряд идущие ошибки и сбрасывается', () => {
    installFakeStorage()
    resetLoginFailCount()
    expect(readLoginFailCount()).toBe(0)
    expect(bumpLoginFailCount()).toBe(1)
    expect(bumpLoginFailCount()).toBe(2)
    resetLoginFailCount()
    expect(readLoginFailCount()).toBe(0)
  })
})

describe('buildSupportReport', () => {
  test('отчёт без секретов, с регионом и шагами', () => {
    const report = buildSupportReport({
      reason: 'shape',
      diaryUrl: 'https://poo.tomedu.ru',
      detail: 'Login response has no student',
      steps: [
        {
          id: 'internet',
          label: 'Подключение к интернету',
          status: 'ok',
          detail: 'Соединение есть (12 мс)'
        }
      ],
      region: null
    })

    expect(report).toContain('poo.tomedu.ru')
    expect(report).toContain('Login response has no student')
    expect(report).toContain('Подключение к интернету')
    expect(report).not.toContain('tr206711')
  })
})
