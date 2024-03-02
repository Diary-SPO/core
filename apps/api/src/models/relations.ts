import { forceSyncDatabase, sequelize } from '@db'
import {
  AbsenceTypeModel,
  AcademicYearModel,
  AuthModel,
  ClassroomModel,
  DiaryUserModel,
  ExaminationTypeModel,
  FinalMarkModel,
  GroupModel,
  LessonTypeModel,
  MarkModel,
  MarkValueModel,
  RequiredModel,
  SPOModel,
  ScheduleModel,
  ScheduleSubgroupModel,
  SubgroupModel,
  SubjectModel,
  TaskModel,
  TaskTypeModel,
  TeacherModel,
  TermModel,
  TermSubjectModel,
  TermTypeModel,
  ThemeModel,
  AbsenceModel
} from './import'

// SPO <--->> Group
SPOModel.hasMany(GroupModel)
GroupModel.belongsTo(SPOModel)

// Task <-->> Required
TaskModel.hasMany(RequiredModel)
RequiredModel.belongsTo(TaskModel)

// Group <--->> DiaryUser
GroupModel.hasMany(DiaryUserModel)
DiaryUserModel.belongsTo(GroupModel)

// DiaryUser <-->> Auth
DiaryUserModel.hasMany(AuthModel)
AuthModel.belongsTo(DiaryUserModel)

// SPO <-->> Teacher
SPOModel.hasMany(TeacherModel)
TeacherModel.belongsTo(SPOModel)

// Group <-->> Schedule
GroupModel.hasMany(ScheduleModel)
ScheduleModel.belongsTo(GroupModel)

// Teacher <-->> Schedule
TeacherModel.hasMany(ScheduleModel)
ScheduleModel.belongsTo(TeacherModel)

// Group <-->> AcademicYear
GroupModel.hasMany(AcademicYearModel)
AcademicYearModel.belongsTo(GroupModel)

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

// LessonType <-->> Schedule
LessonTypeModel.hasMany(ScheduleModel)
ScheduleModel.belongsTo(LessonTypeModel)

// ScheduleModel <-->> Theme
ScheduleModel.hasMany(ThemeModel)
ThemeModel.belongsTo(ScheduleModel)

// ScheduleModel <-->> Task
ScheduleModel.hasMany(TaskModel)
TaskModel.belongsTo(ScheduleModel)

// TaskType <-->> Task
TaskTypeModel.hasMany(TaskModel)
TaskModel.belongsTo(TaskTypeModel)

// Task <-->> Mark
TaskModel.hasMany(MarkModel)
MarkModel.belongsTo(TaskModel)

// DiaryUser <-->> Mark
DiaryUserModel.hasMany(MarkModel)
MarkModel.belongsTo(DiaryUserModel)

// Classroom <-->> Schedule
ClassroomModel.hasMany(ScheduleModel)
ScheduleModel.belongsTo(ClassroomModel)

// SPO <-->> Classroom
SPOModel.hasMany(ClassroomModel)
ClassroomModel.belongsTo(SPOModel)

// Subject <-->> Schedule
SubjectModel.hasMany(ScheduleModel)
ScheduleModel.belongsTo(SubjectModel)

// Subject <-->> TermSubject
SubjectModel.hasMany(TermSubjectModel)
TermSubjectModel.belongsTo(SubjectModel)

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
MarkValueModel.hasMany(FinalMarkModel)
FinalMarkModel.belongsTo(MarkValueModel)

// MarkValue <-->> TermSubject
MarkValueModel.hasMany(TermSubjectModel)
TermSubjectModel.belongsTo(MarkValueModel)

// Group <-->> Subgroup
GroupModel.hasMany(SubgroupModel)
SubgroupModel.belongsTo(GroupModel)

// Subgroup <-->> scheduleSubgroup
SubgroupModel.hasMany(ScheduleSubgroupModel)
ScheduleSubgroupModel.belongsTo(SubgroupModel)

// DiaryUser <-->> scheduleSubgroup
DiaryUserModel.hasMany(ScheduleSubgroupModel)
ScheduleSubgroupModel.belongsTo(DiaryUserModel)

// Schedule <-->> ScheduleSubgroup
ScheduleModel.hasMany(ScheduleSubgroupModel)
ScheduleSubgroupModel.belongsTo(ScheduleModel)

// AbsenceType <-->> Absence
AbsenceTypeModel.hasMany(AbsenceModel)
AbsenceModel.belongsTo(AbsenceTypeModel)

// Schedule <-->> Absence
ScheduleModel.hasMany(AbsenceModel)
AbsenceModel.belongsTo(ScheduleModel)

// DiaryUser <-->> Absence
DiaryUserModel.hasMany(AbsenceModel)
AbsenceModel.belongsTo(DiaryUserModel)

if (forceSyncDatabase) {
  console.log('Syncing database...')
  await sequelize.sync({
  })
}
