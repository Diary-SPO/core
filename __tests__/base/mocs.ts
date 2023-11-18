import { Lesson } from '@diary-spo/shared'
import { IMarksByDay } from '../../src/components'

/** Переданные данные **/
export const mockTextWithLinks =
  'Check out this website: https://www.example.com.'

export const mockLesson: Lesson = {
  name: 'Math',
  startTime: '2023-01-01T10:00:00',
  endTime: '2023-01-01T11:30:00',
  timetable: {
    classroom: { id: 1, building: 'A', name: '101' },
    teacher: { id: 2, lastName: 'Smith', firstName: 'John', middleName: 'Doe' },
  },
  gradebook: {
    absenceType: 'IsAbsent',
    id: 123,
    lessonType: 'Lecture',
    themes: ['Theme 1', 'Theme 2'],
  },
}

export const mockLessonInvalid: Lesson = {
  endTime: '',
  startTime: '',
  name: 'Math',
  timetable: {
    classroom: { id: 1, building: 'A', name: '' },
  },
  gradebook: {
    absenceType: 'IsAbsent',
    id: null,
    lessonType: '',
    tasks: undefined,
    themes: ['Theme 1', 'Theme 2'],
  },
  tasks: undefined,
}

export const mockMarksByDay: IMarksByDay = {
  '2023-01-01': {
    Math: [5, 5, 5],
    Physics: [4, 5, 4],
  },
  '2023-01-02': {
    English: [4, 5, 5],
    Chemistry: [5, 5, 5],
  },
}

/** Ожидаемые данные **/
export const expectedLessonDetailsValid = {
  lessonData: {
    name: 'Math',
    gradebook: {
      absenceType: 'IsAbsent',
      id: 123,
      lessonType: 'Lecture',
      themes: ['Theme 1', 'Theme 2'],
    },
    timetable: {
      classroom: {
        id: 0,
        building: '',
        name: '101',
      },
      teacher: {
        id: 2,
        lastName: 'Smith',
        firstName: 'John',
        middleName: 'Doe',
      },
    },
    startTime: '2023-01-01T10:00:00',
    endTime: '2023-01-01T11:30:00',
  },
  lessonMainInfo: {
    name: 'Math',
    lessonType: 'Lecture',
    themes: ['Theme 1', 'Theme 2'],
    teacherName: 'Smith John Doe',
  },
  lessonTimePlaceInfo: {
    startTime: '2023-01-01T10:00:00',
    endTime: '2023-01-01T11:30:00',
    classroomName: '101',
  },
}

export const expectedLessonDetailsInvalid = {
  lessonData: {
    name: 'Math',
    gradebook: {
      absenceType: 'IsAbsent',
      id: 0,
      lessonType: 'Не задан',
      tasks: undefined,
      themes: ['Theme 1', 'Theme 2'],
    },
    timetable: {
      classroom: {
        id: 0,
        building: '',
        name: 'Нет кабинета',
      },
      teacher: {
        id: 0,
        lastName: '',
        firstName: '',
        middleName: '',
      },
    },
    startTime: 'Что-то не так с датой',
    endTime: 'Что-то не так с датой',
  },
  lessonMainInfo: {
    name: 'Math',
    lessonType: 'Не задан',
    themes: ['Theme 1', 'Theme 2'],
    teacherName: 'Не указан',
  },
  lessonTimePlaceInfo: {
    startTime: 'Ошибка',
    endTime: 'Ошибка',
    classroomName: 'Нет кабинета',
  },
}
