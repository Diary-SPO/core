import type { Task } from '@diary-spo/shared'
import { type ICacheData, retriesForError } from '@helpers'
import {
  type IScheduleModel,
  type ITermDetectP,
  deleteTasksNotIn,
  markSaveOrGet,
  requiredSaveOrGet
} from '@models'
import { markDelete } from '@models'
import { objPropertyCopy } from 'src/helpers/objPropertyCopy'
import { taskTypeSaveOrGet } from 'src/models/TaskType'
import { TaskModel } from '../../model'

export const tasksSaveOrGet = async (
  tasks: Task[],
  schedule: IScheduleModel,
  authData: ICacheData,
  termPromise?: ITermDetectP
) => {
  const promises = []
  const scheduleId = schedule.id

  // Удаляем устаревшие таски
  // TODO: проверить работоспособность после исправления
  deleteTasksNotIn(tasks, scheduleId)

  for (const task of tasks) {
    const taskTypeId = (
      await retriesForError(taskTypeSaveOrGet, [task.type], 3)
    ).id
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
        const task = result[0]
        if (result[1]) {
          return task
        }
        objPropertyCopy(task, taskToSave)
        return task.save()
      })
      // Сохраняем или обновляем обязательность оценок
      // TODO: СДЕЛАТЬ УДАЛЕНИЕ ОБЯЗАТЕЛЬНОСТИ ОЦЕНОК
      .then(async (result) => {
        const required = await requiredSaveOrGet(
          task.isRequired,
          result.id,
          authData
        )
        return { result, required }
      })
      // Сохраняем или обновляем оценки
      .then(async (result) => {
        const taskId = result.required.taskId
        const taskReturn = result.result

        let termId

        if (termPromise) {
          termId = await termPromise
        }

        if (!termPromise || !termId) {
          return taskReturn
        }

        // На всякий який (ну и пустышки не берём)
        if (task.mark) {
          markSaveOrGet(task.mark, schedule, taskId, termId, authData)
        } else {
          markDelete(taskId, authData)
        }

        return taskReturn
      })
    // Сохраняем в массив промисов
    promises.push(promise)
  }

  return promises
}
