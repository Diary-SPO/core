import type { Lesson } from '@diary-spo/shared'

export const cleanData: Lesson = {
  name: '',
  gradebook: {
    id: 0,
    lessonType: '',
    tasks: [],
    themes: []
  },
  timetable: {
    classroom: {
      building: '',
      id: 0,
      name: ''
    },
    teacher: {
      id: 0,
      lastName: '',
      firstName: '',
      middleName: ''
    }
  },
  startTime: '',
  endTime: ''
}
