import { Task } from '@diary-spo/shared'
import {
  calculateAverageMark,
  createSubjectMarksMap,
  getBackgroundColor,
  getSize,
  setDefaultMark
} from '@utils'
import { describe, expect, it } from 'vitest'

import {
  expectedMapData,
  expectedMapDataWithoutMarks,
  mockData,
  mockDataWithoutMarks
} from './mocks'

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

describe('getBackgroundColor', () => {
  it('возвращает цвет для числовой оценки', () => {
    const color1 = getBackgroundColor(5)
    expect(color1).toEqual('linear-gradient(135deg,#50c750,#32b332)')

    const color2 = getBackgroundColor(3)
    expect(color2).toEqual('#F59802')

    const color3 = getBackgroundColor(1)
    expect(color3).toEqual('#DA0A35')
  })

  it('возвращает цвет для строковой оценки', () => {
    const color1 = getBackgroundColor('ДЗ')
    expect(color1).toEqual('#4966CF')

    const color2 = getBackgroundColor('О')
    expect(color2).toEqual('#ffb060')

    const color3 = getBackgroundColor('Н')
    expect(color3).toEqual('#DA0A35')

    const color4 = getBackgroundColor('invalid')
    expect(color4).toEqual('#959595')
  })

  it('возвращает корректные цвета для числовых оценок выше 5', () => {
    const color = getBackgroundColor(6)
    expect(color).toEqual('var(--vkui--color_accent_purple)')
  })
})

describe('getSize', () => {
  it('возвращает размер', () => {
    const s = getSize('s')
    expect(s).toEqual('1rem')

    const l = getSize('l')
    expect(l).toEqual('3rem')

    /**
     * В коде мы не передаём "неправильный" параметр
     * Но лучше покрыть тестом этот случай
     */
    // @ts-expect-error
    const invalid = getSize('invalid size')
    expect(invalid).toBeUndefined()
  })
})

describe('setDefaultMark', () => {
  it('возвращает "Д", если задача обязательна и оценки нет', () => {
    const task: Task = {
      attachments: [],
      id: 0,
      type: undefined,
      isRequired: true,
      mark: null
    }

    const mark = setDefaultMark(task)
    expect(mark).toBe('Д')
  })

  it('возвращает "ДЗ", если задача имеет тип "Home" и оценки нет', () => {
    const task: Task = {
      attachments: [],
      id: 0,
      isRequired: false,
      type: 'Home',
      mark: null
    }

    const mark = setDefaultMark(task)
    expect(mark).toBe('ДЗ')
  })

  it('возвращает соответствующую оценку из списка Grade, если оценка есть', () => {
    const task: Task = {
      attachments: [],
      id: 0,
      isRequired: false,
      type: undefined,
      mark: 'Five'
    }

    const mark = setDefaultMark(task)
    expect(mark).toBe(5)
  })

  it('обрабатывает неопознанную оценку правильно', () => {
    const task: Task = {
      attachments: [],
      id: 0,
      isRequired: false,
      type: undefined,
      mark: 'Unknown'
    }

    const mark = setDefaultMark(task)
    expect(mark).toBeUndefined()
  })

  it('обрабатывает задачу без обязательности и без оценки', () => {
    const task: Task = {
      attachments: [],
      id: 0,
      type: undefined,
      isRequired: false,
      mark: null
    }

    const mark = setDefaultMark(task)
    expect(mark).toBeUndefined()
  })
})
