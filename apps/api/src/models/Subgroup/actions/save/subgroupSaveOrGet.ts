import { type ISubgroupModelType, SubgroupModel } from '@models'

export const subgroupSaveOrGet = (
  name: string,
  groupId: number
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
