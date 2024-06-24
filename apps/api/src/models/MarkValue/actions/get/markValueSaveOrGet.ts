import type { MarkKeys } from '@diary-spo/shared'
import { MarkValueModel } from '../../model'

export const markValueSaveOrGet = async (value: MarkKeys) =>
  MarkValueModel.findOrCreate({
    where: {
      value
    },
    defaults: {
      value
    }
  }).then((v) => v[0])
