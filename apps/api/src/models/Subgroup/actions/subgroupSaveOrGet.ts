import { SubgroupModel } from "../model";

export const subgroupSaveOrGet = (name: string, groupId: number) => {
  const where = {
    name,
    groupId
  }
  return SubgroupModel.findOrCreate({
    where,
    defaults: where
  })
}