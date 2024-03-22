import { ICacheData } from '@helpers'
import {
  AbsenceModel,
  AbsenceTypeModel,
  detectTerm,
  MarkModel,
  MarkValueModel,
  ScheduleModel,
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
        }
      ],
      where: {
        date: {
          [Op.gte]: termStartDate
        }
      }
    }
  })) as IPerformanceFromDB[]
  return structurizeResponse(result)
}
