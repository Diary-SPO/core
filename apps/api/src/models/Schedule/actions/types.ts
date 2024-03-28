import { 
  IAbsenceModel,
  IAbsenceTypeModel,
  IClassroomModelType,
  ILessonTypeModel,
  IMarkModelType, 
  IMarkValueModelType, 
  IRequiredModel, 
  IScheduleModel, 
  IScheduleSubgroupModelType, 
  ISubjectModelType, 
  ITaskModel, 
  ITaskTypeModel, 
  ITeacherModel,
  IThemeModelType
} from '@models'

export type ScheduleSubgroupsGet = IScheduleModel & {
  scheduleSubgroups: IScheduleSubgroupModelType[]
}

export type ScheduleWhere = {
  groupId: number
  startTime: string
  endTime: string
  date: Date | string
  subjectId?: number
}

/* Ответ из БД */
export type ScheduleFromDB = IScheduleModel & {
  scheduleSubgroups: IScheduleSubgroupModelType[]
  lessonType: ILessonTypeModel
  subject: ISubjectModelType
  classroom: IClassroomModelType
  teacher: ITeacherModel
  themes: IThemeModelType[]
  absences: Array<IAbsenceModel & {
    absenceType: IAbsenceTypeModel
  }>
  tasks: Array<ITaskModel & {
    taskType: ITaskTypeModel,
    requireds: IRequiredModel[],
    marks: Array<IMarkModelType & {
      markValue: IMarkValueModelType
    }>
  }>
}