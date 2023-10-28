import { Lesson } from 'diary-shared'

export const cleanData: Lesson = {
  name: '',
  gradebook: {
    id: 0,
    lessonType: '',
    tasks: [],
    themes: [],
  },
  timetable: {
    classroom: {
      building: '',
      id: 0,
      name: '',
    },
    teacher: {
      id: 0,
      lastName: '',
      firstName: '',
      middleName: '',
    },
  },
  startTime: '',
  endTime: '',
}
