import type { Lesson, Nullable } from '@diary-spo/shared'
import { type ICacheData, objPropertyCopy, retriesForError } from '@helpers'
import { deleteAbsence, saveOrGetAbsence } from '../../../Absence'
import { absenceTypeSaveOrGet } from '../../../AbsenceType'
import { saveClassroom } from '../../../Classroom'
import { lessonTypeSaveOrGet } from '../../../LessonType'
import {
  deleteScheduleSubgroup,
  scheduleSubgroupSaveOrGet
} from '../../../ScheduleSubgroup'
import { detectSubgroup, subgroupSaveOrGet } from '../../../Subgroup'
import { subjectSaveOrGet } from '../../../Subject'
import { tasksSaveOrGet } from '../../../Task'
import { teacherSaveOrGet } from '../../../Teacher'
import type { ITermDetectP } from '../../../Term'
import { themesSaveOrGet } from '../../../Theme'
import {
  type IScheduleModel,
  type IScheduleModelNoId,
  ScheduleModel
} from '../../model'
import type { ScheduleWhere } from '../types'

/**
 * Сохраняет и обновляет занятие в базе данных.
 * @param date
 * @param lesson - Занятие для сохранения
 * @param authData - Данные, предоставленные клиентом для авторизации
 * @param termPromise
 * @param systemInitiator
 * @returns Promise<IScheduleModel | null>
 */
export const lessonSave = async (
  date: Date,
  lesson: Lesson,
  authData: ICacheData,
  termPromise?: ITermDetectP,
  systemInitiator = false
): Promise<IScheduleModel | null> => {
  /**
   * Пропускаем пустые занятия типа:
   * { "startTime": "8:30", "endTime": "10:45" }
   */
  if (Object.keys(lesson).length <= 2 || !lesson.name) {
    return null
  }

  // Извлекаем нужные нам данные из lesson
  let teacherId: Nullable<bigint> = null
  let classroomId: Nullable<bigint> = null
  let lessonTypeId: Nullable<number> = null
  let absenceTypeId: Nullable<number> = null
  let gradebookIdFromDiary: Nullable<number> = null

  const subject = lesson.name
  const gradebook = lesson.gradebook
  const subgroup = detectSubgroup(subject)

  // Получаем id в базе для полученных из lesson данных
  const subjectId = (await retriesForError(subjectSaveOrGet, [subject], 2)).id

  if (lesson.timetable.teacher) {
    const LessonTeacher = {
      ...lesson.timetable.teacher,
      id: undefined, // Вырезаем из оригинальной записи id
      spoId: authData.spoId,
      idFromDiary: lesson.timetable.teacher.id
    }
    teacherId = (await retriesForError(teacherSaveOrGet, [LessonTeacher], 2)).id
  }

  if (lesson.timetable.classroom) {
    const classroom = {
      ...lesson.timetable.classroom,
      id: undefined,
      spoId: authData.spoId,
      idFromDiary: lesson.timetable.classroom?.id
    }
    classroomId = (await retriesForError(saveClassroom, [classroom], 2)).id
  }

  if (gradebook) {
    gradebookIdFromDiary = gradebook.id
  }

  if (gradebook?.lessonType) {
    lessonTypeId = (
      await retriesForError(lessonTypeSaveOrGet, [gradebook.lessonType], 2)
    ).id
  }

  if (gradebook?.absenceType) {
    absenceTypeId = (
      await retriesForError(absenceTypeSaveOrGet, [gradebook.absenceType], 2)
    ).id
  }

  // Ищем, есть ли расисание в базе
  const where: ScheduleWhere = {
    groupId: authData.groupId,
    startTime: lesson.startTime,
    endTime: lesson.endTime,
    date: date,
    subjectId
  }

  // Подготавливаем расписание для сохранения в базу
  const scheduleToSave: IScheduleModelNoId = {
    teacherId,
    subjectId,
    classroomId,
    lessonTypeId,
    gradebookIdFromDiary,
    ...where
  }

  // Похоже это не надо...
  /*if (subgroup) {
    where.subjectId = subjectId
  }*/

  const [schedule, isCreated] = await ScheduleModel.findOrCreate({
    where,
    defaults: scheduleToSave
  })

  /**
   * Если расписание есть в базе, то
   * пробуем сравнить поля и если они поменялись, то
   * он (метод save) сделает запрос для сохранения
   */
  if (!isCreated) {
    objPropertyCopy(schedule, scheduleToSave)
  }

  // Промис актуального расписания в БД
  const promiseToReturn = schedule.save()

  // Если есть подгруппа - сохраняем
  if (subgroup) {
    retriesForError(subgroupSaveOrGet, [subgroup, authData.groupId], 2).then(
      async (r) => {
        const scheduleId = (await promiseToReturn).id
        retriesForError(
          scheduleSubgroupSaveOrGet,
          [scheduleId, authData.localUserId, r[0].id],
          2
        )
      }
    )
  }

  // Удаляем подгруппы, если в расписании их нет
  promiseToReturn.then(async (s) => {
    if (!subgroup) {
      deleteScheduleSubgroup(s.id, authData.localUserId)
    }
  })

  if (gradebook?.themes) {
    const scheduleId = (await promiseToReturn).id
    retriesForError(themesSaveOrGet, [gradebook.themes, scheduleId], 2)
  }

  // Сохраняем "задачи" (оценки там же)
  if (gradebook?.tasks?.length) {
    const schedule = await promiseToReturn
    retriesForError(
      tasksSaveOrGet,
      [gradebook.tasks, schedule, authData, termPromise, systemInitiator],
      2
    )
  }

  // Сохраняем опоздания (если есть)
  promiseToReturn.then(async (s) => {
    if (absenceTypeId) {
      retriesForError(
        saveOrGetAbsence,
        [absenceTypeId, s.id, authData.localUserId],
        2
      )
    } else {
      deleteAbsence(s.id, authData.localUserId)
    }
    return s
  })

  return promiseToReturn
}
