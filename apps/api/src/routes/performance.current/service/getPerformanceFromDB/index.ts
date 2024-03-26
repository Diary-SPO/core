import { ICacheData } from '@helpers'
import {
  AbsenceModel,
  AbsenceTypeModel,
  detectTerm,
  MarkModel,
  MarkValueModel,
  ScheduleModel,
  ScheduleSubgroupModel,
  SubgroupModel,
  SubjectModel,
  TaskModel
} from '@models'
import { structurizeResponse } from './structurizeResponse'
import { IPerformanceFromDB } from './types'
import { Op } from 'sequelize'

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
              required: true
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
        }
      }
    }
  })) as IPerformanceFromDB[]
  return structurizeResponse(result, authData)
}
