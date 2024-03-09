import { Lesson, Nullable } from '@diary-spo/shared'
import { ICacheData, objPropertyCopy, retriesForError } from '@helpers'
import {
  IScheduleModel,
  IScheduleModelNoId,
  ScheduleModel,
  ScheduleWhere,
  TeacherSaveOrGet as teacherSaveOrGet,
  deleteAbsence,
  deleteScheduleSubgroup,
  detectSubgroup,
  lessonTypeSaveOrGet,
  saveClassroom,
  saveOrGetAbsence,
  saveOrGetAbsenceType as absenceTypeSaveOrGet,
  scheduleSubgroupSaveOrGet,
  subgroupSaveOrGet,
  subjectSaveOrGet,
  tasksSaveOrGet,
  themesSaveOrGet,
  ITermDetectP
} from '@models'

/**
 * Сохраняет и обновляет занятие в базе данных.
 * @param lesson - Занятие для сохранения
 * @param authData - Данные, предоставленные клиентом для авторизации
 * @returns Promise<IScheduleModel | null>
 */
export const lessonSave = async (
  date: Date,
  lesson: Lesson,
  authData: ICacheData,
  termPromise?: ITermDetectP
): Promise<IScheduleModel | null> => {
  /**
   * Пропускаем пустые занятия типа:
   * { "startTime": "8:30", "endTime": "10:45" }
   */
  if (Object.keys(lesson).length <= 2 || !lesson.name) {
    return null
  }

  // Извлекаем нужные нам данные из lesson
  let subjectId: Nullable<number> = null
  let teacherId: Nullable<number> = null
  let classroomId: Nullable<number> = null
  let lessonTypeId: Nullable<number> = null
  let absenceTypeId: Nullable<number> = null
  let gradebookIdFromDiary: Nullable<number> = null

  const subject = lesson.name
  const gradebook = lesson.gradebook
  const subgroup = detectSubgroup(subject)

  // Получаем id в базе для полученных из lesson данных
  subjectId = (await retriesForError(
    subjectSaveOrGet,
    [subject],
    2
  )).id

  if (lesson.timetable.teacher) {
    const LessonTeacher = {
      ...lesson.timetable.teacher,
      id: undefined, // Вырезаем из оригинальной записи id
      spoId: authData.spoId,
      idFromDiary: lesson.timetable.teacher.id
    }
    teacherId = (
      await retriesForError(
        teacherSaveOrGet,
        [LessonTeacher],
        2
      )).id
  }

  if (lesson.timetable.classroom) {
    const classroom = {
      ...lesson.timetable.classroom,
      id: undefined,
      spoId: authData.spoId,
      idFromDiary: lesson.timetable.classroom?.id
    }
    classroomId = (
      await retriesForError(
        saveClassroom,
        [classroom],
        2
      )).id
  }

  if (gradebook) {
    lessonTypeId = (
      await retriesForError(
        lessonTypeSaveOrGet,
        [gradebook.lessonType],
        2
      )).id
    gradebookIdFromDiary = gradebook.id
  }

  if (gradebook?.absenceType) {
    absenceTypeId = (
      await retriesForError(
        absenceTypeSaveOrGet,
        [gradebook.absenceType],
        2
      )).id
  }

  // Ищем, есть ли расисание в базе
  const where: ScheduleWhere = {
    groupId: authData.groupId,
    startTime: lesson.startTime,
    endTime: lesson.endTime,
    date: date
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

  const schedule = await ScheduleModel.findOne({ where })

  // Промис актуального расписания в БД
  let promiseToReturn: Promise<IScheduleModel>

  /**
   * Если расписание есть в базе, то
   * пробуем поменять поля и если они поменялись, то
   * он (метод save) сделает запрос для сохранения
   */
  if (schedule) {
    objPropertyCopy(schedule, scheduleToSave)
    promiseToReturn = schedule.save()
  } else {
    promiseToReturn = ScheduleModel.create(scheduleToSave)
  }

  if (gradebook?.themes) {
    const scheduleId = (await promiseToReturn).id
    retriesForError(
      themesSaveOrGet,
      [gradebook.themes, scheduleId],
      2
    )
  }

  // Сохраняем "задачи" (оценки там же)
  if (gradebook?.tasks) {
    const schedule = await promiseToReturn
    retriesForError(
      tasksSaveOrGet,
      [gradebook.tasks, schedule, authData, termPromise],
      2
    )
  }

  // Если есть подгруппа - сохраняем
  if (subgroup) {
    const subgroupDB = retriesForError(
      subgroupSaveOrGet,
      [subgroup, authData.groupId],
      2
    )
    subgroupDB.then(async (r) => {
      const scheduleId = (await promiseToReturn).id
      if (!r[1]) {
        retriesForError(
          scheduleSubgroupSaveOrGet,
          [scheduleId, authData.localUserId, r[0].id],
          2
        )
      }
    })
  }

  // Удаляем подгруппы, если в расписании их нет
  promiseToReturn.then(async (s) => {
    if (!subgroup) {
      deleteScheduleSubgroup(s.id, authData.localUserId)
    }
  })

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
