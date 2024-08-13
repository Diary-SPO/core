import type { Optional } from 'sequelize'
import { LogError } from 'src/LogError'
import { checkSameKeys } from '../../helpers/checkDataForObject'
import { SubgroupModel, type SubgroupModelType } from './model'

export const subgroupSaveOrGet = async (
  subgroup: Optional<SubgroupModelType, 'id'>
) => {
  const [record, isCreated] = await SubgroupModel.findOrCreate({
    where: {
      ...subgroup
    },
    defaults: {
      ...subgroup
    }
  }).catch(() => {
    throw new LogError(
      `Ошибка сохранения Subgroup. Входные данные: ${JSON.stringify(subgroup)}`
    )
  })

  if (!isCreated && !checkSameKeys(subgroup, record)) {
    return await record.update({
      ...subgroup
    })
  }

  return record
}
