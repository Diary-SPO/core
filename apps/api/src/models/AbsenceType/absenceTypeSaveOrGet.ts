import type { AbsenceTypesKeys } from '@diary-spo/shared'
import { AbsenceTypeModel } from './model'

export const AbsenceTypeSaveOrGet = async (name: AbsenceTypesKeys) => {
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
