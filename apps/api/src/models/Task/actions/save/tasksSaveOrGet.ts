import type { Task } from '@diary-spo/shared'
import { type ICacheData, retriesForError } from '@helpers'

import { objPropertyCopy } from 'src/helpers/objPropertyCopy'
import { taskTypeSaveOrGet } from 'src/models/TaskType'
import { addNewMarkEvent } from '../../../../worker/notificator/bot'
import { markDelete, markGetByData, markSaveOrGet } from '../../../Mark'
import { markValueGetById } from '../../../MarkValue/actions/get/markValueGetById'
import { requiredSaveOrGet } from '../../../Required'
import type { IScheduleModel } from '../../../Schedule'
import type { ITermDetectP } from '../../../Term'
import { TaskModel } from '../../model'
import { deleteTasks } from '../delete'

export const tasksSaveOrGet = async (
  tasks: Task[],
  schedule: IScheduleModel,
  authData: ICacheData,
  termPromise?: ITermDetectP,
  systemInitiator = false
) => {
  const promises = []
  const scheduleId = schedule.id

  // Удаляем устаревшие таски
  // TODO: проверить работоспособность после исправления
  deleteTasks(tasks, scheduleId)

  for (const task of tasks) {
    const taskTypeId = (
      await retriesForError(taskTypeSaveOrGet, [task.type], 3)
    ).id
    const taskToSave = {
      scheduleId,
      topic: task?.topic ?? 'Не указано',
      idFromDiary: task.id,
      condition: task.condition ?? null,
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

        let termId: bigint | undefined

        if (termPromise) {
          termId = await termPromise
        }

        if (!termPromise || !termId) {
          return taskReturn
        }

        // На всякий який (ну и пустышки не берём)
        if (task.mark) {
          markSaveOrGet(
            task.mark,
            schedule,
            taskId,
            termId,
            authData,
            task,
            systemInitiator
          )
        } else {
          const deletedMarkRaw = await markGetByData(taskId, authData)

          markDelete(taskId, authData).then(async (count) => {
            // Игнорируем не системные инициализаторы (т.е. если пользователь уже сам посмотрел)
            if (count > 0 && systemInitiator && deletedMarkRaw) {
              const markValue = await markValueGetById(
                deletedMarkRaw.markValueId
              )
              if (markValue)
                // Регистрируем событие удаления оценки
                addNewMarkEvent({
                  mark: markValue.value,
                  task,
                  diaryUserId: authData.localUserId,
                  status: 'DELETE',
                  eventDatetime: new Date(),
                  previousMarkId: null
                })
            }
          })
        }

        return taskReturn
      })
    // Сохраняем в массив промисов
    promises.push(promise)
  }

  return promises
}
