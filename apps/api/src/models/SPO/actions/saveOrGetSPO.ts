import type { Optional } from 'sequelize'
import { type ISPOModel, SPOModel, type SPOModelType } from '../model'

export const saveOrGetSPO = async (
  data: Optional<SPOModelType, 'id'>
): Promise<ISPOModel> => {
  const [record, isCreat] = await SPOModel.findOrCreate({
    where: {
      organizationId: data.organizationId
    },
    defaults: {
      ...data
    }
  })

  if (!isCreat) {
    // Без await, т.к. обновляем "в фоне"
    record.update({
      ...data
    })
  }

  return record
}
