import { describe, expect, test } from 'bun:test'

import { DiaryClientError, isLoginShapeError } from './client.ts'

describe('isLoginShapeError', () => {
  test('ответ 200 с битой формой - наша сторона', () => {
    expect(
      isLoginShapeError(
        new DiaryClientError('Login response has no student', 502)
      )
    ).toBe(true)
  })

  test('прочие ошибки - не форма', () => {
    expect(
      isLoginShapeError(new DiaryClientError('Diary request failed', 401))
    ).toBe(false)
    expect(isLoginShapeError(new Error('boom'))).toBe(false)
    expect(isLoginShapeError(null)).toBe(false)
  })
})
