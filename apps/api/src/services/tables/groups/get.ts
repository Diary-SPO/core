import { GroupsModel, IGroupsModel } from 'src/services/models'

export const getGroupInfo = async (groupId: number): Promise<IGroupsModel | null> =>
    await GroupsModel.findOne({
      where: {
        id: groupId
      }
    })