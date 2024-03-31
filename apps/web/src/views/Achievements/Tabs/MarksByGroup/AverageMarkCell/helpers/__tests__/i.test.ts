import { describe, expect, it } from 'bun:test'
import type { MarkKeys } from '@diary-spo/shared'
import { createSubjectMarksMatrix } from '@utils'
import { calculateAverageMark } from '../index.ts'
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
    const average = calculateAverageMark([
      'Invalid',
      'Unknown'
    ] as unknown as MarkKeys[])
    expect(average).toEqual(null)
  })

  it('вычисляет средний балл для массива валидных оценок', () => {
    const validMarks: MarkKeys[] = ['Five', 'Four', 'Three', 'Two']
    const average = calculateAverageMark(validMarks)
    expect(average).toEqual(3.5)
  })

  it('вычисляет средний балл для массива с некоторыми невалидными оценками', () => {
    const mixedMarks = ['Five', 'Invalid', 'Four', 'Unknown', 'Three']
    const average = calculateAverageMark(mixedMarks as MarkKeys[])
    expect(average).toEqual(4)
  })
})

describe('createSubjectMarksMatrix', () => {
  it('создает коллекцию для статистики', () => {
    const mockPerformance = mockData

    const expectedMap = expectedMapData

    const result = createSubjectMarksMatrix(mockPerformance)
    expect(result).toEqual(expectedMap)
  })

  it('создает коллекцию для статистики без оценок', () => {
    const mockPerformance = mockDataWithoutMarks

    const expectedMap = expectedMapDataWithoutMarks

    const result = createSubjectMarksMatrix(mockPerformance)
    expect(result).toEqual(expectedMap)
  })
})
