export interface Lesson {
  endTime: Date
  startTime: Date
  name: string | null
  timetable: {
    classroom: {
      building: string
      id: number
      name: string
    },
    teacher: {
      firstName: string
      id: number
      lastName: string
      middleName: string
    }
  } | undefined
}
export interface Day {
  date: Date;
  lessons: Lesson[] | null
}
