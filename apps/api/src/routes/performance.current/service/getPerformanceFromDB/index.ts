import { ICacheData } from '@helpers'
import {
  AbsenceModel,
  AbsenceTypeModel,
  MarkModel,
  MarkValueModel,
  ScheduleModel,
  SubjectModel,
  TaskModel
} from '@models'
import { structurizeResponse } from './structurizeResponse'
import { IPerformanceFromDB } from './types'

export const getPerformanceFromDB = async (authData: ICacheData) => {
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
          include: [{
            model: AbsenceTypeModel,
            required: true
          }],
          where: {
            diaryUserId: authData.localUserId
          },
          required: false
        }
      ]
    }
  })) as IPerformanceFromDB[]
  return structurizeResponse(result)
}
