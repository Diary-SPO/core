import type { ICacheData } from '@helpers'
import {
  AbsenceModel,
  AbsenceTypeModel,
  MarkModel,
  MarkValueModel,
  ScheduleModel,
  ScheduleSubgroupModel,
  SubjectModel,
  TaskModel,
  detectTerm
} from '@models'
import { Op } from 'sequelize'
import { structurizeResponse } from '../helpers'
import type { IPerformanceFromDB } from '../types'

export const getPerformanceFromDB = async (authData: ICacheData) => {
  if (!authData.termStartDate) {
    await detectTerm(authData)
  }
  const termStartDate = authData.termStartDate
  const result = (await SubjectModel.findAll({
    include: {
      model: ScheduleModel,
      include: [
        {
          model: TaskModel,
          include: [
            {
              model: MarkModel,
              include: [
                {
                  model: MarkValueModel,
                  required: true,
                  attributes: ['value']
                }
              ],
              where: {
                diaryUserId: authData.localUserId
              },
              required: false
            }
          ],
          required: false
        },
        {
          model: AbsenceModel,
          include: [
            {
              model: AbsenceTypeModel,
              required: true
            }
          ],
          where: {
            diaryUserId: authData.localUserId
          },
          required: false
        },
        {
          model: ScheduleSubgroupModel,
          required: false
        }
      ],
      where: {
        date: {
          [Op.gte]: termStartDate
        },
        groupId: authData.groupId
      }
    }
  })) as IPerformanceFromDB[]
  return structurizeResponse(result, authData)
}
