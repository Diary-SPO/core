import { type ISubgroupModelType, SubgroupModel } from '../../model'

export const subgroupSaveOrGet = (
  name: string,
  groupId: bigint
): Promise<[ISubgroupModelType, boolean]> => {
  const where = {
    name,
    groupId
  }

  return SubgroupModel.findOrCreate({
    where,
    defaults: where
  }).catch(async () =>
    subgroupSaveOrGet(name, groupId).catch(() => {
      throw new Error('Ошибка сохранения Subgroup')
    })
  )
}
