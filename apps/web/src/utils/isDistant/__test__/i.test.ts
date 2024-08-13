import { describe, expect, it } from 'bun:test'
import { isDistant } from '@utils'

describe('isDistant', () => {
  it('should return true when input is distant', () => {
    expect(isDistant('Д')).toEqual(true)
    expect(isDistant('д')).toEqual(true)
    expect(isDistant('ДО')).toEqual(true)
    expect(isDistant('до')).toEqual(true)
    expect(isDistant('0')).toEqual(true)
  })

  it('should return false when input is not distant', () => {
    expect(isDistant('17')).toEqual(false)
    expect(isDistant('15 кабинет')).toEqual(false)
    expect(isDistant('')).toEqual(false)
  })
})
