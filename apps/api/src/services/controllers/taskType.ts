import { LessonWorkTypeKeys } from '@diary-spo/shared'
import { TaskTypeModel } from '@db'

export const TaskTypeSaveOrGet = async (name: LessonWorkTypeKeys) => {
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
