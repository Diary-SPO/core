import { GroupModel, type IGroupModel } from '../../../Group'

export const saveOrGetGroup = async (
  id: number,
  name: string,
  spoId: bigint
): Promise<IGroupModel> => {
  const obj = {
    idFromDiary: id,
    spoId
  }

  const [record, isCreat] = await GroupModel.findOrCreate({
    where: {
      ...obj
    },
    defaults: {
      ...obj,
      groupName: name
    }
  })

  if (!isCreat) {
    // Без await, т.к. обновляем "в фоне"
    record.update({
      groupName: name
    })
  }

  return record
}
