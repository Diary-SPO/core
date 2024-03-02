import { Lesson, Nullable } from '@diary-spo/shared'
import { ICacheData, objPropertyCopy } from '@helpers'
import {
  subjectSaveOrGet,
  TeacherSaveOrGet,
  saveClassroom,
  IScheduleModel,
  IScheduleModelNoId,
  ScheduleModel,
  themesSaveOrGet,
  AbsenceTypeSaveOrGet,
  lessonTypeSaveOrGet,
  tasksSaveOrGet,
  subgroupSaveOrGet,
  scheduleSubgroupSaveOrGet,
  deleteScheduleSubgroup,
  ScheduleWhere,
  saveOrGetAbsence,
  deleteAbsence,
  detectSubgroup
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
  authData: ICacheData
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
  subjectId = (await subjectSaveOrGet(subject)).id

  if (lesson.timetable.teacher) {
    const LessonTeacher = {
      ...lesson.timetable.teacher,
      id: undefined, // Вырезаем из оригинальной записи id
      spoId: authData.spoId,
      idFromDiary: lesson.timetable.teacher.id
    }
    teacherId = (await TeacherSaveOrGet(LessonTeacher)).id
  }

  if (lesson.timetable.classroom) {
    const classroom = {
      ...lesson.timetable.classroom,
      id: undefined,
      spoId: authData.spoId,
      idFromDiary: lesson.timetable.classroom?.id
    }
    classroomId = (await saveClassroom(classroom)).id
  }

  if (gradebook) {
    lessonTypeId = (await lessonTypeSaveOrGet(gradebook.lessonType)).id
    gradebookIdFromDiary = gradebook.id
  }

  if (gradebook && gradebook.absenceType) {
    absenceTypeId = (await AbsenceTypeSaveOrGet(gradebook.absenceType)).id
  }

  // Подготавливаем расписание для сохранения в базу
  const scheduleToSave: IScheduleModelNoId = {
    groupId: authData.groupId,
    teacherId,
    subjectId,
    classroomId,
    lessonTypeId,
    gradebookIdFromDiary,
    startTime: lesson.startTime,
    endTime: lesson.endTime,
    date: date
  }

  // Ищем, есть ли расисание в базе
  let where: ScheduleWhere = {
    groupId: scheduleToSave.groupId,
    startTime: scheduleToSave.startTime,
    endTime: scheduleToSave.endTime,
    date: scheduleToSave.date
  }

  if (subgroup) {
    where.subjectId = subjectId
  }

  const schedule = await ScheduleModel.findOne({ where })

  // Промис актуального расписания в БД
  let promiseToReturn: Promise<IScheduleModel>

  /**
   * Если расписание есть в базе, то
   * пробуем поменять поля и если онипоменялись, то
   * он (метод save) сделает запрос для сохранения
   */
  if (schedule) {
    objPropertyCopy(schedule, scheduleToSave)
    promiseToReturn = schedule.save()
  } else {
    promiseToReturn = ScheduleModel.create(scheduleToSave)
  }

  if (gradebook && gradebook.themes) {
    const scheduleId = (await promiseToReturn).id
    themesSaveOrGet(gradebook.themes, scheduleId)
  }

  if (gradebook && gradebook.tasks) {
    const scheduleId = (await promiseToReturn).id
    tasksSaveOrGet(gradebook.tasks, scheduleId, authData)
  }

  // Если есть подгруппа - сохраняем
  if (subgroup) {
    const subgroupDB = subgroupSaveOrGet(subgroup, authData.groupId)
    subgroupDB.then(async (r) => {
      const scheduleId = (await promiseToReturn).id
      if (!r[1]) {
        scheduleSubgroupSaveOrGet(scheduleId, authData.localUserId, r[0].id)
      }
    })
  }

  // Удаялем пподгруппы, если в расписании их нет
  promiseToReturn.then(async (s) => {
    if (!subgroup) {
      deleteScheduleSubgroup(s.id, authData.localUserId)
    }
  })

  promiseToReturn.then(async (s) => {
    if (absenceTypeId) {
      saveOrGetAbsence(absenceTypeId, s.id, authData.localUserId)
    } else {
      deleteAbsence(s.id, authData.localUserId)
    }
    return s
  })

  return promiseToReturn
}