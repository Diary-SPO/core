import { checkSameKeys } from "../helpers/checkDataForObject"
import { ClassroomModel, ClassroomModelType } from "../models/classroom"
import { Optional } from "sequelize"

export const ClassroomSave = async (classroom: Optional<ClassroomModelType, 'id'>) => {
  const [record, isCreated] = await ClassroomModel.findOrCreate({
    where: {
      idFromDiary: classroom.idFromDiary,
      spoId: classroom.spoId
    },
    defaults: {
      ...classroom
    }
  }).catch(() => {
    throw new Error(`[${new Date().toISOString()}] => Ошибка сохранения Classroom. Входные данные: ${JSON.stringify(classroom)}`)
  })

  if (!isCreated && checkSameKeys(classroom, record)) {
    return await record.update({
      ...classroom
    })
  }

  return record
}