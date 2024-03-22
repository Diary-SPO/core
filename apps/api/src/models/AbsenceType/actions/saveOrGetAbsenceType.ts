import { AbsenceTypesKeys } from '@diary-spo/shared'
import { AbsenceTypeModel, IAbsenceTypeModel } from '@models'

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
