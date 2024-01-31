import { LessonTypeModel } from 'src/services/models'
import { DBLessonType } from '../types'

export const updateLessonType = async (
  name: string
): Promise<DBLessonType | null> => {
  const existingLessonType = await LessonTypeModel.findOne({
    where: {
      name
    }
  })

  if (existingLessonType) {
    return existingLessonType as unknown as DBLessonType
  }

  return await LessonTypeModel.create({
    name
  }) as unknown as DBLessonType
}
