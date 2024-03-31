import type { TermSubjectExaminationKeys } from '@diary-spo/shared'
import { TermSubjectExaminationTypeModel } from '../../model'

export const saveOrGetTermSubjectExaminationType = async (
  type: TermSubjectExaminationKeys
) => {
  return TermSubjectExaminationTypeModel.findOrCreate({
    where: {
      name: type
    },
    defaults: {
      name: type
    }
  }).then((v) => v[0])
}
