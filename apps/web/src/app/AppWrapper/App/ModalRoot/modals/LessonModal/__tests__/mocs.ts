import type { Lesson } from '@diary-spo/shared'

export const mockLesson: Lesson = {
  name: 'Math',
  startTime: '2023-01-01T10:00:00',
  endTime: '2023-01-01T11:30:00',
  timetable: {
    classroom: { id: 1, building: 'A', name: '101' },
    teacher: { id: 2, lastName: 'Smith', firstName: 'John', middleName: 'Doe' }
  },
  gradebook: {
    absenceType: 'IsAbsent',
    id: 123,
    lessonType: 'Lecture',
    themes: ['Theme 1', 'Theme 2']
  }
}

export const mockLessonInvalid: Lesson = {
  endTime: '',
  startTime: '',
  name: 'Math',
  timetable: {
    classroom: { id: 1, building: 'A', name: '' }
  },
  gradebook: {
    absenceType: 'IsAbsent',
    id: null,
    lessonType: '',
    tasks: undefined,
    themes: ['Theme 1', 'Theme 2']
  },
  tasks: undefined
}

/** Ожидаемые данные **/
export const expectedLessonDetailsValid = {
  lessonData: {
    name: 'Math',
    gradebook: {
      absenceType: 'IsAbsent',
      id: 123,
      lessonType: 'Lecture',
      themes: ['Theme 1', 'Theme 2']
    },
    timetable: {
      classroom: {
        id: 0,
        building: '',
        name: '101'
      },
      teacher: {
        id: 2,
        lastName: 'Smith',
        firstName: 'John',
        middleName: 'Doe'
      }
    },
    startTime: '2023-01-01T10:00:00',
    endTime: '2023-01-01T11:30:00'
  },
  lessonMainInfo: {
    name: 'Math',
    lessonType: 'Lecture',
    themes: ['Theme 1', 'Theme 2'],
    teacherName: 'Smith John Doe'
  },
  lessonTimePlaceInfo: {
    startTime: '2023-01-01T10:00:00',
    endTime: '2023-01-01T11:30:00',
    classroomName: '101'
  }
}

export const expectedLessonDetailsInvalid = {
  lessonData: {
    name: 'Math',
    gradebook: {
      absenceType: 'IsAbsent',
      id: 0,
      lessonType: '',
      tasks: undefined,
      themes: ['Theme 1', 'Theme 2']
    },
    timetable: {
      classroom: {
        id: 0,
        building: '',
        name: 'Нет кабинета'
      },
      teacher: {
        id: 0,
        lastName: '',
        firstName: '',
        middleName: ''
      }
    },
    startTime: 'Что-то не так с датой',
    endTime: 'Что-то не так с датой'
  },
  lessonMainInfo: {
    name: 'Math',
    lessonType: '',
    themes: ['Theme 1', 'Theme 2'],
    teacherName: 'Не указан'
  },
  lessonTimePlaceInfo: {
    startTime: 'Ошибка',
    endTime: 'Ошибка',
    classroomName: 'Нет кабинета'
  }
}
