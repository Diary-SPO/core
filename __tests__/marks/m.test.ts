import { expect, describe, it } from 'vitest'
import {
  calculateAverageMark,
  createSubjectMarksMap,
  extractMarksByDay,
  getBackgroundColor,
  getSize,
  setDefaultMark,
} from '@utils'

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
  it('Создает коллекцию для статистики', () => {})
})

describe('extractMarksByDay', () => {
  it('', () => {})
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
  it('Возвращает размер', () => {})
})

describe('setDefaultMark', () => {
  it('Возвращает оценку', () => {})
})
