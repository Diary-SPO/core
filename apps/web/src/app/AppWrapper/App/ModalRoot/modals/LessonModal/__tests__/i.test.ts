import { describe, expect, it } from 'bun:test'
import { formatLessonName, setLessonDetails } from '../helpers.ts'
import { getLessonMarkDescription } from '../LessonTasks.tsx'
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

  it('не должна выводить undefined, если у преподавателя нет отчества', () => {
    const result = setLessonDetails({
      ...mockLesson,
      timetable: {
        ...mockLesson.timetable,
        teacher: {
          ...mockLesson.timetable.teacher,
          middleName: undefined
        }
      }
    })

    expect(result.lessonMainInfo.teacherName).toBe('Smith John')
  })

  it('должна выводить только заполненные части ФИО преподавателя', () => {
    const teacherNames = [
      {
        teacher: { id: 2, lastName: 'Smith', firstName: '', middleName: 'Doe' },
        expected: 'Smith Doe'
      },
      {
        teacher: { id: 2, lastName: '', firstName: 'John', middleName: '' },
        expected: 'John'
      },
      {
        teacher: { id: 2, lastName: ' ', firstName: '', middleName: undefined },
        expected: 'Не указан'
      }
    ]

    for (const { teacher, expected } of teacherNames) {
      const result = setLessonDetails({
        ...mockLesson,
        timetable: { ...mockLesson.timetable, teacher }
      })

      expect(result.lessonMainInfo.teacherName).toBe(expected)
    }
  })
})

describe('getLessonMarkDescription', () => {
  it('расшифровывает оценки и обозначения в подробностях пары', () => {
    expect(getLessonMarkDescription(5)).toBe('Оценка 5 — отлично')
    expect(getLessonMarkDescription('Зч')).toBe('Зачёт')
    expect(getLessonMarkDescription('Д')).toBe('Долг')
    expect(getLessonMarkDescription('НП')).toBe(
      'Пропуск по неуважительной причине'
    )
    expect(getLessonMarkDescription(undefined)).toBeUndefined()
  })
})

/** formatLessonName **/
it('должна корректно форматировать название урока', () => {
  const lessonName = 'МДК 01.01/1 подгруппа'
  const result = formatLessonName(lessonName)
  expect(result).toBe('МДК 01.01 (1 подгруппа)')
})
