import type { Lesson } from '@diary-spo/shared'
import { DBSchedule, DBTeacher } from '../../../types/databaseTypes'
import { updateGradebook } from '../gradebook'
import { getGroupInfo } from '../groups'
import { saveTeacher } from '../teacher'
import { updateSchedule } from './update'

export const saveSchedule = async (
  schedule: Lesson,
  groupId: number,
  date: string
): Promise<DBSchedule | null> => {
  if (!schedule?.name || !schedule?.timetable?.teacher) {
    return null
  }

  const groupInfo = await getGroupInfo(groupId)

  if (!groupInfo || !groupInfo?.spoId) {
    console.error(
      'Ошибка получения/сохранения группы во время сохранения расписания в базе!'
    )
    return null
  }

  // Тут будет лежать запись уже из нашей базы, с учителем, который пришёл от дневника
  const teacher: DBTeacher = await saveTeacher(
    schedule.timetable.teacher,
    groupInfo.spoId
  )

  if (!teacher || !teacher?.id) {
    console.error(
      'Ошибка сохранения/получения учителя при внесении занятия в базу!'
    )
    return null
  }

  const actualSchedule = await updateSchedule({
    groupId,
    teacherId: teacher.id,
    classroomBuilding: schedule.timetable.classroom.building,
    classroomName: schedule.timetable.classroom.name,
    subjectName: schedule.name,
    date,
    startTime: schedule.startTime,
    endTime: schedule.endTime
  })

  if (actualSchedule) {
    await updateGradebook(actualSchedule, schedule)
  }

  return actualSchedule
}
