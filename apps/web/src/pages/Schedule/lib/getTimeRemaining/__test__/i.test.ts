import { describe, expect, it } from 'bun:test'
import { getTimeRemaining } from '../index.ts'

describe('getTimeRemaining', () => {
  it('должна возвращать null, если урок уже завершился', () => {
    const currentDate = new Date('2023-01-01T18:00:00')
    const endTime = new Date('2023-01-01T13:00:00')
    const startDate = new Date('2023-01-01T11:00:00')

    const result = getTimeRemaining(currentDate, endTime, startDate)

    expect(result).toBe(null)
  })

  it('должна возвращать null, если урок еще не начался', () => {
    const currentDate = new Date('2023-01-01T10:00:00')
    const endTime = new Date('2023-01-01T13:00:00')
    const startDate = new Date('2023-01-01T13:00:00')

    const result = getTimeRemaining(currentDate, endTime, startDate)

    expect(result).toBe(null)
  })

  it('должна возвращать null, если до начала урока более 1 часа', () => {
    const currentDate = new Date('2023-01-01T10:00:00')
    const endTime = new Date('2023-01-01T12:00:00')
    const startDate = new Date('2023-01-01T13:00:00')

    const result = getTimeRemaining(currentDate, endTime, startDate)

    expect(result).toBe(null)
  })

  it('должна возвращать время до начала урока в формате "N мин до начала"', () => {
    const currentDate = new Date('2023-01-01T10:00:00')
    const endTime = new Date('2023-01-01T12:00:00')
    const startDate = new Date('2023-01-01T11:30:00')

    const result = getTimeRemaining(currentDate, endTime, startDate)

    expect(result).toBe('90 мин до начала')
  })

  it('должна возвращать время до конца урока в формате "N мин до конца"', () => {
    const currentDate = new Date('2023-01-01T11:00:00')
    const endTime = new Date('2023-01-01T12:30:00')
    const startDate = new Date('2023-01-01T10:00:00')

    const result = getTimeRemaining(currentDate, endTime, startDate)

    expect(result).toBe('90 мин до конца')
  })
})
