import { ICacheData } from '@helpers'
import {
  AbsenceModel,
  AbsenceTypeModel,
  ClassroomModel,
  LessonTypeModel,
  MarkModel,
  MarkValueModel,
  RequiredModel,
  ScheduleFromDB,
  ScheduleModel,
  ScheduleSubgroupModel,
  SubjectModel,
  TaskModel,
  TaskTypeModel,
  TeacherModel,
  ThemeModel
} from '@models'
import { Op } from 'sequelize'

export const ScheduleGetFromDB = async (
  startDate: string,
  endDate: string,
  authData: ICacheData
) => {
  return (await ScheduleModel.findAll({
    where: {
      [Op.and]: [
        { date: { [Op.gte]: startDate } },
        { date: { [Op.lte]: endDate } },
        { groupId: authData.groupId }
      ]
    },
    include: [
      {
        model: ScheduleSubgroupModel,
        required: false
      },
      LessonTypeModel,
      SubjectModel,
      ClassroomModel,
      ThemeModel,
      {
        model: TeacherModel,
        required: false
      },
      {
        model: AbsenceModel,
        include: [
          {
            model: AbsenceTypeModel
          }
        ],
        where: {
          diaryUserId: authData.localUserId
        },
        required: false
      },
      {
        model: TaskModel,
        include: [
          TaskTypeModel,
          {
            model: RequiredModel,
            where: {
              diaryUserId: authData.localUserId
            }
          },
          {
            model: MarkModel,
            include: [
              {
                model: MarkValueModel
              }
            ],
            where: {
              diaryUserId: authData.localUserId
            },
            required: false
          }
        ],
        required: false
      }
    ]
  })) as ScheduleFromDB[]
}
