import { describe, expect, it } from 'bun:test'
import { formatLessonName, setLessonDetails } from '../helpers.ts'
import {
  expectedLessonDetailsInvalid,
  expectedLessonDetailsValid,
  mockLesson,
  mockLessonInvalid
} from './mocs.ts'

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

/** formatLessonName **/
it('должна корректно форматировать название урока', () => {
  const lessonName = 'МДК 01.01/1 подгруппа'
  const result = formatLessonName(lessonName)
  expect(result).toBe('МДК 01.01 (1 подгруппа)')
})
