import { truncateString } from '@utils'
import { describe, expect, it } from 'vitest'

/** truncateString **/
describe('truncateString', () => {
  it('должна вернуть исходную строку, если ее длина не превышает maxLength', () => {
    const inputString = 'Hello, World!'
    const maxLength = 15

    const result = truncateString(inputString, maxLength)

    expect(result).toBe(inputString)
  })

  it('должна обрезать строку и добавлять многоточие, если ее длина превышает maxLength', () => {
    const inputString =
      'Это очееееень длинная строка, которую необходимо обрезать'
    const maxLength = 20

    const result = truncateString(inputString, maxLength)

    expect(result).toBe('Это очееееень длинна...')
  })

  it('должна возвращать исходную строку, если maxLength меньше или равно 0', () => {
    const inputString = 'Testing with maxLength <= 0'
    const maxLength = 0

    const result = truncateString(inputString, maxLength)

    expect(result).toBe(inputString)
  })
})
