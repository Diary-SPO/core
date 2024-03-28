import { LessonTypeKeys } from '@diary-spo/shared'
import { ILessonTypeModel, LessonTypeModel } from '@models'

export const lessonTypeSaveOrGet = async (
  name: LessonTypeKeys
): Promise<ILessonTypeModel> =>
  LessonTypeModel.findOrCreate({
    where: {
      name
    },
    defaults: {
      name
    }
  }).then((v) => v[0])
