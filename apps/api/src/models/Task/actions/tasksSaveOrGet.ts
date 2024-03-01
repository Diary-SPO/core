import { Task } from "@diary-spo/shared";
import { taskTypeSaveOrGet } from "src/models/TaskType";
import { TaskModel } from "../model";
import { objPropertyCopy } from "src/helpers/objPropertyCopy";
import { deleteTasksNotIn } from "./deleteNotIn";
import { requiredSaveOrGet } from "src/models/Required";
import { ICacheData } from "@helpers";

export const tasksSaveOrGet = async (tasks: Task[], scheduleId: number, authData: ICacheData) => {
  const promises = []

  // Удаляем устаревшие таски
  deleteTasksNotIn(tasks, scheduleId)

  for (const task of tasks) {
    const taskTypeId = (await taskTypeSaveOrGet(task.type)).id
    const taskToSave = {
      scheduleId,
      topic: task?.topic ?? 'Не указано',
      idFromDiary: task.id,
      taskTypeId
    }
    const promise = TaskModel.findOrCreate({
      where: {
        scheduleId,
        idFromDiary: task.id
      },
      defaults: {
        ...taskToSave
      }
    })
    // Проверяем, нужно ли обновить и отдаём
    promise
    .then((result) => {
      let task = result[0]
      if (result[1]) {
        return task
      }
      objPropertyCopy(task, taskToSave)
      return task.save()
    })
    .then((result) => {
      requiredSaveOrGet(task.isRequired, result.id, authData)
    })
    // Сохраняем в массив промисов
    promises.push(promise)
  }

  return promises
}