import type { AbsenceTypesKeys } from '@diary-spo/shared'
import { AbsenceTypeModel, type IAbsenceTypeModel } from '../../model'

export const absenceTypeSaveOrGet = async (
  name: AbsenceTypesKeys
): Promise<IAbsenceTypeModel> =>
  AbsenceTypeModel.findOrCreate({
    where: {
      name
    },
    defaults: {
      name
    }
  }).then((v) => v[0])
