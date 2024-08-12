import type { ICacheData } from '@helpers'

import { Op } from 'sequelize'
import { AbsenceModel } from '../../../Absence'
import { AbsenceTypeModel } from '../../../AbsenceType'
import { ClassroomModel } from '../../../Classroom'
import { LessonTypeModel } from '../../../LessonType'
import { MarkModel } from '../../../Mark'
import { MarkValueModel } from '../../../MarkValue'
import { RequiredModel } from '../../../Required'
import { ScheduleSubgroupModel } from '../../../ScheduleSubgroup'
import { SubjectModel } from '../../../Subject'
import { TaskModel } from '../../../Task'
import { TaskTypeModel } from '../../../TaskType'
import { TeacherModel } from '../../../Teacher'
import { ThemeModel } from '../../../Theme'
import { ScheduleModel } from '../../model'
import type { ScheduleFromDB } from '../types'

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
// нужен хороший комментарий насчет этой функции (и других функций) + избавление от as
