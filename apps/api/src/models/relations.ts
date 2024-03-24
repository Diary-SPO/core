import { forceSyncDatabase, sequelize } from '@db'
import {
  AbsenceModel,
  AbsenceTypeModel,
  AcademicYearModel,
  AdsModel,
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
  TermUserModel,
  ThemeModel,
  TermSubjectExaminationTypeModel
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
AcademicYearModel.hasMany(TermModel)
TermModel.belongsTo(AcademicYearModel)

// Term <-->> TermSubject
TermModel.hasMany(TermSubjectModel)
TermSubjectModel.belongsTo(TermModel)

// TermSubject <-->> ExaminationType
ExaminationTypeModel.hasMany(TermSubjectModel)
TermSubjectModel.belongsTo(ExaminationTypeModel)

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
TermTypeModel.hasMany(AcademicYearModel)
AcademicYearModel.belongsTo(TermTypeModel)

// Subject <-->> FinalMark
SubjectModel.hasMany(FinalMarkModel)
FinalMarkModel.belongsTo(SubjectModel)

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

// Term <-->> TermUser
TermModel.hasMany(TermUserModel)
TermUserModel.belongsTo(TermModel)

// DiaryUser <-->> TermUser
DiaryUserModel.hasMany(TermUserModel)
TermUserModel.belongsTo(DiaryUserModel)

// Term <-->> Mark
TermModel.hasMany(MarkModel)
MarkModel.belongsTo(TermModel)

// SPO <-->> Ads
SPOModel.hasMany(AdsModel)
AdsModel.belongsTo(SPOModel)

// termSubjectExaminationTypeId <-->> TermSubject
TermSubjectExaminationTypeModel.hasMany(TermSubjectModel)
TermSubjectModel.belongsTo(TermSubjectExaminationTypeModel)

if (forceSyncDatabase) {
  console.log('Syncing database...')
  await sequelize.sync({})
}
