import { createSubjectMarksMap } from '@utils'
import { describe, expect, it } from 'vitest'
import { calculateAverageMark } from '../helpers.tsx'
import {
  expectedMapData,
  expectedMapDataWithoutMarks,
  mockData,
  mockDataWithoutMarks
} from './mocks.ts'

describe('calculateAverageMark', () => {
  it('возвращает null при пустом массиве оценок', () => {
    const average = calculateAverageMark([])
    expect(average).toEqual(null)
  })

  it('возвращает null при массиве с невалидными оценками', () => {
    const average = calculateAverageMark(['Invalid', 'Unknown'])
    expect(average).toEqual(null)
  })

  it('вычисляет средний балл для массива валидных оценок', () => {
    const validMarks = ['Five', 'Four', 'Three', 'Two', 'One']
    const average = calculateAverageMark(validMarks)
    expect(average).toEqual(3)
  })

  it('вычисляет средний балл для массива с некоторыми невалидными оценками', () => {
    const mixedMarks = ['Five', 'Invalid', 'Four', 'Unknown', 'Three']
    const average = calculateAverageMark(mixedMarks)
    expect(average).toEqual(4)
  })
})

describe('createSubjectMarksMap', () => {
  it('создает коллекцию для статистики', () => {
    const mockPerformance = mockData

    const expectedMap = expectedMapData

    const result = createSubjectMarksMap(mockPerformance)
    expect(result).toEqual(expectedMap)
  })

  it('создает коллекцию для статистики без оценок', () => {
    const mockPerformance = mockDataWithoutMarks

    const expectedMap = expectedMapDataWithoutMarks

    const result = createSubjectMarksMap(mockPerformance)
    expect(result).toEqual(expectedMap)
  })
})
