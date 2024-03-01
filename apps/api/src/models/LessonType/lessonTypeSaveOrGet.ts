import { LessonTypeKeys } from '@diary-spo/shared'
import { LessonTypeModel } from './model'

export const lessonTypeSaveOrGet = async (name: LessonTypeKeys) => {
  const [record] = await LessonTypeModel.findOrCreate({
    where: {
      name
    },
    defaults: {
      name
    }
  })
  return record
}
