import { describe, expect, test } from 'bun:test'

import { getRunnerStoredValue } from './runner-storage.ts'

describe('background runner storage', () => {
  test('returns a stored value', () => {
    expect(
      getRunnerStoredValue({ get: () => ({ value: 'saved' }) }, 'key')
    ).toBe('saved')
  })

  test('returns null when a key does not exist', () => {
    expect(getRunnerStoredValue({ get: () => null }, 'missing')).toBeNull()
  })
})
