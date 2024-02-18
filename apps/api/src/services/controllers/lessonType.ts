import { LessonTypeModel } from "../models"

export const LessonTypeSaveOrGet = async (name: string) => {
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