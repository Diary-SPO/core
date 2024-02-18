import { TaskTypeModel } from "../models"


export const TaskTypeSaveOrGet = async (name: string) => {
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