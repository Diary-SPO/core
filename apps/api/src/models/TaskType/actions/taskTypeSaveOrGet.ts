import { LessonWorkTypeKeys } from '@diary-spo/shared'
import { ITaskTypeModel, TaskTypeModel } from '@models'

export const taskTypeSaveOrGet = async (
  name: LessonWorkTypeKeys
): Promise<ITaskTypeModel> =>
  TaskTypeModel.findOrCreate({
    where: {
      name
    },
    defaults: {
      name
    }
  })
    .then((v) => v[0])
    // Если ошибка - пробуем ещё раз
    .catch(async () =>
      taskTypeSaveOrGet(name).catch(() => {
        throw new Error('Не удалось сохранить taskType')
      })
    )
