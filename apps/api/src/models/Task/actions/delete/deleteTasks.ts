import type { Task } from '@diary-spo/shared'
import { TaskModel } from '@models'
import { Op } from 'sequelize'

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
