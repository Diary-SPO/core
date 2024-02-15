import { GroupModel, IGroupModel } from 'src/services/models'

export const getGroupInfo = async (
  groupId: number
): Promise<IGroupModel | null> =>
  await GroupModel.findOne({
    where: {
      id: groupId
    }
  })
