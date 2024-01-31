import { expect, it } from 'bun:test'
import { formatDateForRequest } from '../helpers.ts'

/** formatDateForRequest **/
it('должна форматировать объект Date в строку', () => {
  const date = new Date(2023, 10, 1)
  const result = formatDateForRequest(date)
  expect(result).toBe('2023-11-01')
})
