import { LessonTypeKeys } from '@diary-spo/shared'
import { LessonTypeModel } from '@db'

export const LessonTypeSaveOrGet = async (name: LessonTypeKeys) => {
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
