import type { ICacheData } from '@helpers'

import { Op } from 'sequelize'
import { ScheduleSubgroupModel } from '../../../ScheduleSubgroup'
import { type IScheduleModel, ScheduleModel } from '../../model'
import { checkInSubgroups } from '../other'
import type { ScheduleSubgroupsGet } from '../types'

export const deleteOldDays = async (
  schedules: (IScheduleModel | null)[],
  authModel: ICacheData
) => {
  /**
   *  Если расписания нет в списке id'шников в schedules
   *  и у расписания не тсвязанной подгруппы или подгруппа
   *  принадлежит текущему пользователю, то удаляем
   *  console.log(JSON.stringify(schedules, null, 2))
   */
  const ids = []
  let date = null

  for (const schedule of schedules) {
    if (schedule) {
      ids.push(schedule.id)
      if (!date) {
        date = schedule.date
      }
    }
  }

  // Если нет даты - то нет и расписания
  if (!date) {
    return
  }

  const schedulesToDelete = ScheduleModel.findAll({
    where: {
      id: {
        [Op.notIn]: ids
      },
      groupId: authModel.groupId,
      date
    },
    include: {
      model: ScheduleSubgroupModel,
      required: false
    }
  }) as Promise<ScheduleSubgroupsGet[]>

  schedulesToDelete.then((s) => {
    //console.log((JSON.stringify(s, null, 2)))
    for (const schedule of s) {
      if (
        schedule.scheduleSubgroups.length === 0 ||
        checkInSubgroups(schedule.scheduleSubgroups, authModel.localUserId)
      ) {
        schedule.destroy()
      }
    }
    return s
  })
}
