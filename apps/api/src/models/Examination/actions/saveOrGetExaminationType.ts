import { ExaminationKeys } from "@diary-spo/shared"
import { ExaminationTypeModel } from "../model"

export const saveOrGetExaminationType = async (type: ExaminationKeys) => {
  return ExaminationTypeModel.findOrCreate({
    where: {
      name: type
    },
    defaults: {
      name: type
    }
  }).then(v => v[0])
}