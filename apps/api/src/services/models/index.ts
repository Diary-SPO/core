import { LessonType } from '@diary-spo/shared'
import { SPOModel } from './SPO'
import { AuthModel } from './auth'
import { DiaryUserModel } from './diaryUser'
import { TeacherModel } from './teacher'
import { ScheduleModel } from './schedule'
import { LessonTypeModel } from './lessonType'
import { GradebookModel } from './gradebook'
import { GroupsModel } from './groups'
import { ThemeModel } from './theme'
import { TaskTypeModel } from './taskType'
import { TaskModel } from './task'
import { MarkModel } from './mark'
import { RequiredsModel } from './requireds'

export * from './SPO'
export * from './groups'
export * from './diaryUser'
export * from './auth'
export * from './teacher'
export * from './schedule'
export * from './lessonType'
export * from './gradebook'
export * from './theme'
export * from './taskType'
export * from './task'
export * from './mark'
export * from './requireds'

// Устанавливаем связи

// SPO <--->> Groups
SPOModel.hasMany(GroupsModel, {
  foreignKey: 'id'
})
GroupsModel.belongsTo(SPOModel, {
  foreignKey: 'spoId'
})

// Groups <--->> DaryUser
GroupsModel.hasMany(DiaryUserModel, {
  foreignKey: 'id'
})
DiaryUserModel.belongsTo(GroupsModel, {
  foreignKey: 'groupId'
})

// DiaryUser <--->> Auth
DiaryUserModel.hasMany(AuthModel, {
  foreignKey: 'id'
})
AuthModel.belongsTo(DiaryUserModel, {
  foreignKey: 'idDiaryUser'
})

// SPO <-->> Teacher
SPOModel.hasMany(TeacherModel, {
  foreignKey: 'id'
})
TeacherModel.belongsTo(SPOModel, {
  foreignKey: 'spoId'
})

// Groups <-->> Schedule
GroupsModel.hasMany(ScheduleModel, {
  foreignKey: 'id'
})
ScheduleModel.belongsTo(GroupsModel, {
  foreignKey: 'groupId'
})

// Schedule <-->> Gradebook
ScheduleModel.hasMany(GradebookModel, {
  foreignKey: 'id'
})
GradebookModel.belongsTo(ScheduleModel, {
  foreignKey: 'scheduleId'
})

// LesonType <-->> Gradebook
LessonTypeModel.hasMany(GradebookModel, {
  foreignKey: 'id'
})
GradebookModel.belongsTo(LessonTypeModel, {
  foreignKey: 'lessonTypeId'
})

// Gradebook <-->> Theme
GradebookModel.hasMany(ThemeModel, {
  foreignKey: 'id'
})
ThemeModel.belongsTo(GradebookModel, {
  foreignKey: 'gradebookId'
})

// Gradebook <-->> Task
GradebookModel.hasMany(TaskModel, {
  foreignKey: 'id'
})
TaskModel.belongsTo(GradebookModel, {
  foreignKey: 'gradebookId'
})

// TaskType <-->> Task
TaskTypeModel.hasMany(TaskModel, {
  foreignKey: 'id'
})
TaskModel.belongsTo(TaskTypeModel, {
  foreignKey: 'taskTypeId'
})

// Task <-->> Mark
TaskModel.hasMany(MarkModel, {
  foreignKey: 'id'
})
MarkModel.belongsTo(TaskModel, {
  foreignKey: 'taskId'
})

// DiaryUser <-->> Mark
DiaryUserModel.hasMany(MarkModel, {
  foreignKey: 'id'
})
MarkModel.belongsTo(DiaryUserModel, {
  foreignKey: 'diaryUserId'
})

// Task <-->> Requireds
TaskModel.hasMany(RequiredsModel, {
  foreignKey: 'id'
})
RequiredsModel.belongsTo(TaskModel, {
  foreignKey: 'taskId'
})

// DiaryUser <-->> Requireds
DiaryUserModel.hasMany(RequiredsModel, {
  foreignKey: 'id'
})
RequiredsModel.belongsTo(DiaryUserModel, {
  foreignKey: 'diaryUserId'
})