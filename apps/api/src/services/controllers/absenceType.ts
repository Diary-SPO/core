import { AbsenceTypeModel } from '../models/absenceType'

export const AbsenceTypeSaveOrGet = async (name: string) => {
  const [record] = await AbsenceTypeModel.findOrCreate({
    where: {
      name
    },
    defaults: {
      name
    }
  })
  return record
}
