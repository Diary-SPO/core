import { it, expect, describe } from 'vitest'
import { isToday, logOut, truncateString } from '@utils'

describe('Тесты базовых утилит', () => {
  /** isToday **/
  describe('isToday', () => {
    it('должна вернуть true для сегодняшней даты', () => {
      const today = new Date()
      const isTodayTrue = isToday(today)
      
      expect(isTodayTrue).toBe(true)
    })
    
    it('должна вернуть false не для сегодняшней даты', () => {
      const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
      const isTodayFalse = isToday(yesterday)
      
      expect(isTodayFalse).toBe(false)
    })
  })
  
  /** logOut **/
  it('должна очистить локальное хранилище', () => {
    logOut()
    
    expect(localStorage.length).toBe(0)
  })
  
  /** truncateString **/
  describe('truncateString', () => {
    it('должна вернуть исходную строку, если ее длина не превышает maxLength', () => {
      const inputString = 'Hello, World!'
      const maxLength = 15
      
      const result = truncateString(inputString, maxLength)
      
      expect(result).toBe(inputString)
    })
    
    it('должна обрезать строку и добавлять многоточие, если ее длина превышает maxLength', () => {
      const inputString = 'Это очееееень длинная строка, которую необходимо обрезать'
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
})
