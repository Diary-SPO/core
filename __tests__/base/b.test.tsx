import { it, expect, describe, vitest } from 'vitest'
import {
  formatDate,
  getTimeRemaining,
  handleResponse,
  isToday,
  logOut,
  setLessonDetails, sortByDay, textToLink,
  truncateString,
} from '@utils'
import {
  expectedLessonDetailsInvalid,
  expectedLessonDetailsValid,
  mockLesson,
  mockLessonInvalid, mockMarksByDay, mockTextWithLinks,
} from './mocs'
import { IMarksByDay } from '../../src/components'

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
      const inputString =
        'Это очееееень длинная строка, которую необходимо обрезать'
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
  
  /** handleResponse **/
  describe('handleResponse', () => {
    /** mock-функции для тестирования **/
    const errorCallbackMock = vitest.fn()
    const limitExceededCallbackMock = vitest.fn()
    const loadingCallbackMock = vitest.fn()
    const showSnackbarMock = vitest.fn()
    
    it('должна вызывать showSnackbar и колбэки при response равном 418', () => {
      const response = 418
      
      handleResponse(
        response,
        errorCallbackMock,
        limitExceededCallbackMock,
        loadingCallbackMock,
        showSnackbarMock,
      )
      
      expect(showSnackbarMock).toHaveBeenCalled()
      
      expect(errorCallbackMock).toHaveBeenCalled()
      expect(loadingCallbackMock).toHaveBeenCalled()
      
      /** Сброс mock-функций **/
      showSnackbarMock.mockReset()
      errorCallbackMock.mockReset()
      loadingCallbackMock.mockReset()
    })
    
    it('должна вызывать limitExceededCallback, errorCallback и loadingCallback при response равном 429', () => {
      const response = 429
      
      handleResponse(
        response,
        errorCallbackMock,
        limitExceededCallbackMock,
        loadingCallbackMock,
      )
      
      expect(limitExceededCallbackMock).toHaveBeenCalled()
      expect(errorCallbackMock).toHaveBeenCalled()
      expect(loadingCallbackMock).toHaveBeenCalled()
      
      limitExceededCallbackMock.mockReset()
      errorCallbackMock.mockReset()
      loadingCallbackMock.mockReset()
    })
    
    it('не должна вызывать коллбеки при положительном ответе от сервера', () => {
      const response = 200
      
      handleResponse(
        response,
        errorCallbackMock,
        limitExceededCallbackMock,
        loadingCallbackMock,
        showSnackbarMock,
      )
      
      expect(showSnackbarMock).not.toHaveBeenCalled()
      expect(errorCallbackMock).not.toHaveBeenCalled()
      expect(loadingCallbackMock).not.toHaveBeenCalled()
      
      /** Сброс mock-функций **/
      showSnackbarMock.mockReset()
      errorCallbackMock.mockReset()
      loadingCallbackMock.mockReset()
    })
  })
  
  /** getTimeRemaining **/
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
  
  /** setLessonDetails **/
  describe('setLessonDetails', () => {
    it('должна правильно обрабатывать данные урока, где какие-то поля не валидные', () => {
      const result = setLessonDetails(mockLesson)
      
      expect(result).toEqual(expectedLessonDetailsValid)
    })
    
    it('должна правильно обрабатывать данные урока, если учитель не задан, и возвращать структурированный объект', () => {
      const result = setLessonDetails(mockLessonInvalid)
      
      expect(result).toEqual(expectedLessonDetailsInvalid)
    })
  })
  
  /** sortByDay **/
  describe('sortByDay', () => {
    it('должна отсортировать оценки по датам', () => {
      const result = sortByDay(mockMarksByDay)
      
      const sortedDays = Object.keys(mockMarksByDay).sort(
        (a, b) => formatDate(b).getTime() - formatDate(a).getTime(),
      )
      
      const sortedMarksByDay: IMarksByDay = {}
      sortedDays.forEach((day) => {
        sortedMarksByDay[day] = mockMarksByDay[day]
      })
      
      expect(result).toEqual(sortedMarksByDay)
    })
  })
  
  /** textToLink **/
  describe('textToLink', () => {
    it('should convert text with links into Link components', () => {
      const result = textToLink(mockTextWithLinks)
      
      expect(Array.isArray(result)).toBe(true)
      
      result.forEach((part) => {
        if (typeof part === 'string') {
          expect(part).not.toMatch(/https?:\/\/\S+/)
        } else {
          expect(part.props.href).toBe('https://www.example.com.')
          expect(part.props.target).toBe('_blank')
        }
      })
    })
  })
})
