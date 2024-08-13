import type { LessonWorkTypeKeys } from '@diary-spo/shared'
import { TaskTypeModel } from './model'

export const taskTypeSaveOrGet = async (name: LessonWorkTypeKeys) => {
  const [record] = await TaskTypeModel.findOrCreate({
    where: {
      name
    },
    defaults: {
      name
    }
  })
  return record
}
