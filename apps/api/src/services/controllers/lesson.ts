import { Lesson } from "@diary-spo/shared";
import { SubjectSaveOrGet } from "./subject";
import { ClassroomSave } from "./classroom";
import { TeacherSaveOrGet } from "./teacher";
import { SubgroupSaveOrGet } from "./subgroup";
import { ScheduleModel } from "../models";
import { ScheduleSubgroupSafeSave } from "./scheduleSubgroup";
import { IUserInfo } from "./diaryUser";
import { GradebookSaveOrGet } from "./gradebook";

export const LessonSave = async (lesson: Lesson, user: IUserInfo, date: Date) => {
  if (Object.keys(lesson).length <= 2) {
    return
  }
  // Забираю переменные
  const splitName = lesson.name ? lesson.name.split("/") : null
  const subgroup = splitName && splitName.length > 1 ? splitName[splitName.length - 1] : null
  const cr = lesson.timetable.classroom
  const tr = lesson.timetable.teacher

  // Сохраняю в БД
  const subjectId = lesson.name ? (await SubjectSaveOrGet(lesson.name)).id : null // subjectId
  const classroomId = (await ClassroomSave({
    name: cr.name,
    spoId: user.group.spoId,
    building: cr.building,
    idFromDiary: cr.id
  }))?.id ?? null
  const teacherId = tr ? (await TeacherSaveOrGet({
    lastName: tr.lastName,
    firstName: tr.firstName,
    middleName: tr.middleName,
    idFromDiary: tr.id,
    spoId: user.group.spoId,
  })).id : null

  const groupId = user.group.id
  const subgroupId = subgroup ? (await SubgroupSaveOrGet({
    groupId: user.group.id,
    name: subgroup
  })).id : null

  const scheduleWhere = {
    groupId,
    teacherId,
    subjectId,
    classroomId,
    date: new Date(date),
    startTime: lesson.startTime,
    endTime: lesson.endTime
  }
  const [schedule] = await ScheduleModel.findOrCreate({
    where: {
      ...scheduleWhere
    },
    defaults: {
      ...scheduleWhere
    }
  })

  if (subgroupId) {
    await ScheduleSubgroupSafeSave(schedule.id, user.id, subgroupId)
  }

  if (lesson.gradebook) {
    GradebookSaveOrGet(schedule.id, lesson.gradebook, user).catch((err) => {
      throw new Error(`[${new Date().toISOString()}] => Ошибка сохранения в функции GradebookSaveOrGet(). Подробнее:`, err)
    })
  }
}