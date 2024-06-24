import type { Task } from '@diary-spo/shared'
import { Op } from 'sequelize'
import { TaskModel } from '../../model'

export const deleteTasks = async (tasks: Task[], scheduleId: bigint) => {
  const ids = tasks.map((v) => v.id) // Оригинальные id'шники заданий

  return TaskModel.destroy({
    where: {
      [Op.and]: [
        {
          scheduleId
        },
        {
          idFromDiary: {
            [Op.notIn]: ids
          }
        }
      ]
    }
  })
}
