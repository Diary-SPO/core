import { Task } from '@diary-spo/shared'
import { requiredSaveOrGet } from '../Required/requiredSaveOrGet'
import { taskTypeSaveOrGet } from '../TaskType/taskTypeSaveOrGet'
import { TaskModel } from '@models'
import { IUserInfo } from '../DiaryUser'

export const tasksSaveOrGet = async (
  gradebookId: number,
  tasks: Task[],
  userInfo: IUserInfo
) => {
  const tasksDB = await TaskModel.findAll({
    where: {
      gradebookId
    }
  })

  const localCopyTasks = Array.from(tasks)

  for (const taskDB of tasksDB) {
    let destroy = true
    for (const task of localCopyTasks) {
      if (task.topic === taskDB.topic) {
        localCopyTasks.splice(localCopyTasks.indexOf(task), 1)
        destroy = false
        await requiredSaveOrGet(taskDB.id, task.isRequired, userInfo)
        break
      }
    }
    if (destroy) {
      taskDB.destroy()
    }
  }

  for (const task of localCopyTasks) {
    if (!task.topic) {
      continue
    }

    const taskDB = await TaskModel.create({
      gradebookId,
      idFromDiary: task.id,
      taskTypeId: (await taskTypeSaveOrGet(task.type)).id,
      topic: task.topic
    })

    await requiredSaveOrGet(taskDB.id, task.isRequired, userInfo)
  }
}
