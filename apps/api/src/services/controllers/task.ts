import { Task } from "@diary-spo/shared"
import { IUserInfo } from "./diaryUser"
import { TaskModel } from "../models"
import { TaskTypeSaveOrGet } from "./taskType"
import { RequiredSaveOrGet } from "./required"

export const TasksSaveOrGet = async (gradebookId: number, tasks: Task[], userInfo: IUserInfo) => {
  const tasksDB = await TaskModel.findAll({
    where: {
      gradebookId
    }
  })

  for (const taskDB of tasksDB) {
    let destroy = true
    for (const task of tasks) {
      if (task.topic === taskDB.topic) {
        tasks.splice(tasks.indexOf(task), 1)
        destroy = false
        await RequiredSaveOrGet(taskDB.id, task.isRequired, userInfo)
        break
      }
    }
    if (destroy) {
      taskDB.destroy()
    }
  }

  for (const task of tasks) {
    if (!task.topic) {
      continue
    }

    const taskDB = await TaskModel.create({
      gradebookId,
      idFromDiary: task.id,
      taskTypeId: (await TaskTypeSaveOrGet(task.type)).id,
      topic: task.topic
    })

    await RequiredSaveOrGet(taskDB.id, task.isRequired, userInfo)
  }
}