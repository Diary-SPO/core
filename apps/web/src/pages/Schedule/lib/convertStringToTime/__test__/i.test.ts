import { describe, expect, it } from 'bun:test'
import { convertStringToTime } from '../index.ts'

describe('convertStringToTime', () => {
  /** convertStringToTime **/
  it('должна конвертировать строку времени в объект Date', () => {
    const baseDate = new Date(2023, 10, 1, 0, 0, 0)
    const result = convertStringToTime('14:30', baseDate)
    expect(result?.getHours()).toBe(14)
    expect(result?.getMinutes()).toBe(30)
  })

  it('должна вернуть null для некорректного формата времени', () => {
    const baseDate = new Date(2023, 10, 1, 0, 0, 0)
    const result = convertStringToTime('25:70', baseDate)
    expect(result).toBe(null)
  })
})
