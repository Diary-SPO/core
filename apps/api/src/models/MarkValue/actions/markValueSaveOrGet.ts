import { MarkKeys } from "@diary-spo/shared"
import { MarkValueModel } from "@models"

export const markValueSaveOrGet = async (value: MarkKeys) =>
MarkValueModel.findOrCreate({
  where: {
    value
  },
  defaults: {
    value
  }
})
.then((v) => v[0])