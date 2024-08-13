import type { ICacheData } from '@helpers'
import { Op } from 'sequelize'

import { AbsenceModel } from '../../../../models/Absence'
import { AbsenceTypeModel } from '../../../../models/AbsenceType'
import { MarkModel } from '../../../../models/Mark'
import { MarkValueModel } from '../../../../models/MarkValue'
import { ScheduleModel } from '../../../../models/Schedule'
import { ScheduleSubgroupModel } from '../../../../models/ScheduleSubgroup'
import { SubjectModel } from '../../../../models/Subject'
import { TaskModel } from '../../../../models/Task'
import { detectTerm } from '../../../../models/Term'
import { getFormattedResponse } from '../helpers'
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
  return getFormattedResponse(result, authData)
}
