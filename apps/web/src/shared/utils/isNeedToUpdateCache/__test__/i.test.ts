import { describe, expect, it } from 'bun:test'
import { THIRD_SEC } from 'src/shared/config'

import { isNeedToUpdateCache } from '../../../index.tsx'

describe('isNeedToUpdateCache', () => {
  it('returns true when key does not exist in localStorage', () => {
    const key = 'nonexistentKey'
    const result = isNeedToUpdateCache(key)

    expect(result).toBe(true)
  })

  it('returns false when last request time is within cache duration', () => {
    const key = 'existingKey'
    const currentTime = Date.now()
    const lastRequestTime = currentTime - (THIRD_SEC - 1000)
    localStorage.setItem(key, String(lastRequestTime))
    const result = isNeedToUpdateCache(key)

    expect(result).toBe(false)

    localStorage.removeItem(key)
  })

  it('returns true when last request time is beyond cache duration', () => {
    const key = 'existingKey'
    const currentTime = Date.now()
    const lastRequestTime = currentTime - (THIRD_SEC + 1000)
    localStorage.setItem(key, String(lastRequestTime))
    const result = isNeedToUpdateCache(key)

    expect(result).toBe(true)

    localStorage.removeItem(key)
  })
})
