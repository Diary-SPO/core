import { describe, expect, it } from 'bun:test'

import { formatClassroomLocation } from '..'

describe('formatClassroomLocation', () => {
  it('выводит корпус и аудиторию', () => {
    expect(
      formatClassroomLocation({ buildingName: 'Корпус 1', name: '101' })
    ).toBe('Корпус 1, каб. 101')
  })

  it('добавляет префикс к числовому названию корпуса', () => {
    expect(formatClassroomLocation({ buildingName: '1', name: '419' })).toBe(
      'корп. 1, каб. 419'
    )
  })

  it('выводит аудиторию без корпуса', () => {
    expect(formatClassroomLocation({ buildingName: '', name: '101' })).toBe(
      'каб. 101'
    )
  })

  it('не добавляет корпус к дистанционному занятию', () => {
    expect(
      formatClassroomLocation({ buildingName: 'Корпус 1', name: 'ДО' })
    ).toBe('ДО')
  })

  it('возвращает заглушку без данных об аудитории', () => {
    expect(formatClassroomLocation()).toBe('Нет кабинета')
  })
})
