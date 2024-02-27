import { Task } from '@diary-spo/shared'
import { RequiredSaveOrGet } from '../Required/requiredSaveOrGet'
import { TaskTypeSaveOrGet } from '../TaskType/taskTypeSaveOrGet'
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
        await RequiredSaveOrGet(taskDB.id, task.isRequired, userInfo)
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
      taskTypeId: (await TaskTypeSaveOrGet(task.type)).id,
      topic: task.topic
    })

    await RequiredSaveOrGet(taskDB.id, task.isRequired, userInfo)
  }
}
