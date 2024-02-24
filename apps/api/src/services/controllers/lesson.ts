import { Lesson } from '@diary-spo/shared'
import { ScheduleModel } from '../models'
import { ClassroomSave } from './classroom'
import { IUserInfo } from './diaryUser'
import { GradebookSaveOrGet } from './gradebook'
import { ScheduleSubgroupSafeSave } from './scheduleSubgroup'
import { SubgroupSaveOrGet } from './subgroup'
import { SubjectSaveOrGet } from './subject'
import { TeacherSaveOrGet } from './teacher'

export const LessonSave = async (
  lesson: Lesson,
  user: IUserInfo,
  date: Date
) => {
  if (Object.keys(lesson).length <= 2) {
    return
  }

  // Забираю переменные
  const splitName = lesson.name ? lesson.name.split('/') : null
  const subgroup =
    splitName && splitName.length > 1 ? splitName[splitName.length - 1] : null
  const cr = lesson.timetable.classroom
  const tr = lesson.timetable.teacher

  // Сохраняю в БД
  const subjectId = lesson.name
    ? (await SubjectSaveOrGet(lesson.name)).id
    : null // subjectId
  const classroomId =
    (
      await ClassroomSave({
        name: cr.name,
        spoId: user.group.spoId,
        building: cr.building,
        idFromDiary: cr.id
      })
    )?.id ?? null
  const teacherId = tr
    ? (
        await TeacherSaveOrGet({
          lastName: tr.lastName,
          firstName: tr.firstName,
          middleName: tr.middleName,
          idFromDiary: tr.id,
          spoId: user.group.spoId
        })
      ).id
    : null

  const groupId = user.group.id
  const subgroupId = subgroup
    ? (
        await SubgroupSaveOrGet({
          groupId: user.group.id,
          name: subgroup
        })
      ).id
    : null

  // TODO: Удалять в воркере не привязанные градебуки, либо как-то обрабатывать
  let gradebookId = null
  if (lesson.gradebook) {
    gradebookId = GradebookSaveOrGet(lesson.gradebook, user).catch((err) => {
      throw new Error(
        `[${new Date().toISOString()}] => Ошибка сохранения в функции GradebookSaveOrGet(). Подробнее:`,
        err
      )
    })
    gradebookId = (await gradebookId).id
  }

  const scheduleWhere = {
    groupId,
    teacherId,
    subjectId,
    classroomId,
    date: new Date(date).toISOString().split('T')[0], // Т.к. БД обрабатывает даты и приводит к формату гггг-мм-дд, то на вход нужно обработать также
    startTime: lesson.startTime,
    endTime: lesson.endTime,
    gradebookId
  }

  const [schedule] = await ScheduleModel.findOrCreate({
    where: {
      ...scheduleWhere
    },
    defaults: {
      ...scheduleWhere
    }
  }).catch((err) => {
    throw new Error(
      `[${new Date().toISOString()}] => Ошибка сохранения Schedule. Входные данные: ${JSON.stringify(
        scheduleWhere
      )}, ${err}`
    )
  })

  console.log(scheduleWhere.date, schedule.date)

  if (subgroupId && schedule) {
    await ScheduleSubgroupSafeSave(schedule.id, user.id, subgroupId)
  }
}
