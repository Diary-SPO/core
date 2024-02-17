import { describe, expect, it } from 'bun:test'
import { Task } from '@diary-spo/shared'
import { setDefaultMark } from '@utils'
import { getBackgroundColor } from '../helpers.ts'
import { GRAY, GREEN, ORANGE, RED, VIOLET } from '@config'

describe('getBackgroundColor', () => {
  it('возвращает цвет для числовой оценки', () => {
    const color1 = getBackgroundColor(5)
    expect(color1).toEqual(GREEN)

    const color2 = getBackgroundColor(3)
    expect(color2).toEqual(ORANGE)

    const color3 = getBackgroundColor(1)
    expect(color3).toEqual(RED)
  })

  it('возвращает цвет для строковой оценки', () => {
    const color1 = getBackgroundColor('ДЗ')
    expect(color1).toEqual(VIOLET)

    const color2 = getBackgroundColor('О')
    expect(color2).toEqual(ORANGE)

    const color3 = getBackgroundColor('Н')
    expect(color3).toEqual(RED)

    const color4 = getBackgroundColor('invalid')
    expect(color4).toEqual(GRAY)
  })

  it('возвращает корректные цвета для числовых оценок выше 5', () => {
    const color = getBackgroundColor(6)
    expect(color).toEqual(VIOLET)
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
