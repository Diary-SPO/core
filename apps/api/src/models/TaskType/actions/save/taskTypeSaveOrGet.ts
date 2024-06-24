import type { LessonWorkTypeKeys } from '@diary-spo/shared'
import { type ITaskTypeModel, TaskTypeModel } from '../../model'

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
  }).then((v) => v[0])
