import { ILessonTypeModel, LessonTypeModel } from 'src/services/models'

export const updateLessonType = async (
  name: string
): Promise<ILessonTypeModel | null> => {
  const existingLessonType = await LessonTypeModel.findOne({
    where: {
      name
    }
  })

  if (existingLessonType) {
    return existingLessonType
  }

  return await LessonTypeModel.create({
    name
  })
}
