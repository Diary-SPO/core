import { Task } from "@diary-spo/shared";
import { TaskModel } from "../model";
import { Op } from "sequelize";

export const deleteTasksNotIn = async (tasks: Task[], scheduleId: number) => {
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