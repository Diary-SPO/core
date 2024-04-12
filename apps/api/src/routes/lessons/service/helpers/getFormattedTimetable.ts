import type { Timetable } from '@diary-spo/shared'
import type { ScheduleFromDB } from '@models'

export const getFormattedTimetable = (rs: ScheduleFromDB): Timetable => {
  const { building, name: clName, idFromDiary: id } = rs.classroom
  const { firstName, lastName, middleName } = rs.teacher
  return {
    classroom: {
      building,
      name: clName,
      id
    },
    teacher: {
      firstName,
      lastName,
      middleName,
      id: rs.teacher.idFromDiary ?? 0
    }
  }
}
