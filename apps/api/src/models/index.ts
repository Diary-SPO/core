import { forceSyncDatabase, sequelize } from '../initDBConnection'
import { SPOModel } from './SPO'
import { AbsenceTypeModel } from './AbsenceType'
import { AcademicYearModel } from './AcademicYear'
import { AuthModel } from './Auth'
import { ClassroomModel } from './Classroom'
import { DiaryUserModel } from './DiaryUser'
import { ExaminationTypeModel } from './Examination'
import { FinalMarkModel } from './FinalMark'
import { GradebookModel } from './Gradebook'
import { GroupModel } from './Group'
import { LessonTypeModel } from './LessonType'
import { MarkModel } from './Mark'
import { MarkValueModel } from './MarkValue'
import { NotificationDetailedModel } from './notificationDetailed'
import { RequiredModel } from './Required'
import { ScheduleModel } from './Schedule'
import { ScheduleSubgroupModel } from './ScheduleSubgroup'
import { SocialStepTypeModel } from './socialStepType'
import { SocialTypeModel } from './socialType'
import { SubgroupModel } from './Subgroup'
import { SubjectModel } from './Subject'
import { SubscriptionModel } from './subscription'
import { SubscriptionTypeModel } from './subscriptionType'
import { TaskModel } from './Task'
import { TaskTypeModel } from './TaskType'
import { TeacherModel } from './Teacher'
import { TermModel } from './Term'
import { TermSubjectModel } from './TermSubject'
import { TermTypeModel } from './TermType'
import { ThemeModel } from './Theme'

export * from './SPO'
export * from './Group'
export * from './DiaryUser'
export * from './Auth'
export * from './Teacher'
export * from './Schedule'
export * from './LessonType'
export * from './Gradebook'
export * from './Theme'
export * from './TaskType'
export * from './Task'
export * from './Mark'
export * from './Required'

// TODO: разделить на файлы, связи отдельно от экспортов

// Устанавливаем связи

// SPO <--->> Group
SPOModel.hasMany(GroupModel, {
  foreignKey: 'id'
})
GroupModel.belongsTo(SPOModel, {
  foreignKey: 'spoId'
})

// Task <-->> Required
TaskModel.hasMany(RequiredModel)
RequiredModel.belongsTo(TaskModel)

// Group <--->> DiaryUser
GroupModel.hasMany(DiaryUserModel, {
  foreignKey: 'id'
})
DiaryUserModel.belongsTo(GroupModel, {
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

// Group <-->> Schedule
GroupModel.hasMany(ScheduleModel, {
  foreignKey: 'id'
})
ScheduleModel.belongsTo(GroupModel, {
  foreignKey: 'groupId'
})

// Teacher <-->> Schedule
TeacherModel.hasMany(ScheduleModel, {
  foreignKey: 'id'
})
ScheduleModel.belongsTo(TeacherModel, {
  foreignKey: 'teacherId'
})

// Group <-->> AcademicYear
GroupModel.hasMany(AcademicYearModel, {
  foreignKey: 'id'
})
AcademicYearModel.belongsTo(GroupModel, {
  foreignKey: 'groupId'
})

// AcademicYear <-->> Term
AcademicYearModel.hasMany(TermModel, {
  foreignKey: 'id'
})
TermModel.belongsTo(AcademicYearModel, {
  foreignKey: 'academicYearId'
})

// Term <-->> TermSubject
TermModel.hasMany(TermSubjectModel, {
  foreignKey: 'id'
})
TermSubjectModel.belongsTo(TermModel, {
  foreignKey: 'termId'
})

// TermSubject <-->> ExaminationType
TermSubjectModel.hasMany(ExaminationTypeModel, {
  foreignKey: 'id'
})
ExaminationTypeModel.belongsTo(TermSubjectModel, {
  foreignKey: 'termSubjectId'
})

// Gradebook <-->> Schedule
GradebookModel.hasMany(ScheduleModel)
ScheduleModel.belongsTo(GradebookModel)

// LessonType <-->> Gradebook
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
TaskModel.hasMany(MarkModel)
MarkModel.belongsTo(TaskModel)

// DiaryUser <-->> Mark
DiaryUserModel.hasMany(MarkModel)
MarkModel.belongsTo(DiaryUserModel)

// Classroom <-->> Schedule
ClassroomModel.hasMany(ScheduleModel, {
  foreignKey: 'id'
})
ScheduleModel.belongsTo(ClassroomModel, {
  foreignKey: 'classroomId'
})

// SPO <-->> Classroom
SPOModel.hasMany(ClassroomModel, {
  foreignKey: 'id'
})
ClassroomModel.belongsTo(SPOModel, {
  foreignKey: 'spoId'
})

// Subject <-->> Schedule
SubjectModel.hasMany(ScheduleModel, {
  foreignKey: 'id'
})
ScheduleModel.belongsTo(SubjectModel, {
  foreignKey: 'subjectId'
})

// Subject <-->> TermSubject
SubjectModel.hasMany(TermSubjectModel, {
  foreignKey: 'id'
})
TermSubjectModel.belongsTo(SubjectModel, {
  foreignKey: 'subjectId'
})

// TermType <-->> AcademicYear
TermTypeModel.hasMany(AcademicYearModel, {
  foreignKey: 'id'
})
AcademicYearModel.belongsTo(TermTypeModel, {
  foreignKey: 'termTypeId'
})

// Subject <-->> FinalMark
SubjectModel.hasMany(FinalMarkModel, {
  foreignKey: 'id'
})
FinalMarkModel.belongsTo(SubjectModel, {
  foreignKey: 'subjectId'
})

// MarkValue <-->> Mark
MarkValueModel.hasMany(MarkModel)
MarkModel.belongsTo(MarkValueModel)

// MarkValue <-->> FinalMark
MarkValueModel.hasMany(FinalMarkModel, {
  foreignKey: 'id'
})
FinalMarkModel.belongsTo(MarkValueModel, {
  foreignKey: 'markValueId'
})

// MarkValue <-->> TermSubject
MarkValueModel.hasMany(TermSubjectModel, {
  foreignKey: 'id'
})
TermSubjectModel.belongsTo(MarkValueModel, {
  foreignKey: 'markValueId'
})

// AbsenceType <-->> Gradebook
AbsenceTypeModel.hasMany(GradebookModel, {
  foreignKey: 'id'
})
GradebookModel.belongsTo(AbsenceTypeModel, {
  foreignKey: 'absenceTypeId'
})

// Group <-->> Subgroup
GroupModel.hasMany(SubgroupModel, {
  foreignKey: 'id'
})
SubgroupModel.belongsTo(GroupModel, {
  foreignKey: 'groupId'
})

// Subgroup <-->> scheduleSubgroup
SubgroupModel.hasMany(ScheduleSubgroupModel)
ScheduleSubgroupModel.belongsTo(SubgroupModel)

// DiaryUser <-->> scheduleSubgroup
DiaryUserModel.hasMany(ScheduleSubgroupModel)
ScheduleSubgroupModel.belongsTo(DiaryUserModel)

// Schedule <-->> ScheduleSubgroup
ScheduleModel.hasMany(ScheduleSubgroupModel)
ScheduleSubgroupModel.belongsTo(ScheduleModel)

// SocialType <-->> NotificationDetailed
SocialTypeModel.hasMany(NotificationDetailedModel)
NotificationDetailedModel.belongsTo(SocialTypeModel)

// SocialType <-->> SocialStepType
SocialTypeModel.hasMany(SocialStepTypeModel, { as: 'steps' })
SocialStepTypeModel.belongsTo(SocialTypeModel)

// DiaryUser <->> NotificationDetailed
DiaryUserModel.hasMany(NotificationDetailedModel)
NotificationDetailedModel.belongsTo(DiaryUserModel)

if (forceSyncDatabase) {
  sequelize.sync({
    force: true
  })
}

// SubscriptionType <-->> Subscription
//SubscriptionTypeModel.hasMany(SubscriptionModel)
//SubscriptionModel.belongsTo(SubscriptionTypeModel)

// DiaryUser <-->> Subscription
//DiaryUserModel.hasMany(SubscriptionModel)
//SubscriptionModel.belongsTo(DiaryUserModel)
