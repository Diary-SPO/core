import type { AbsenceTypesKeys } from '@diary-spo/shared'
import { AbsenceTypeModel, type IAbsenceTypeModel } from '@models'

export const saveOrGetAbsenceType = async (
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
