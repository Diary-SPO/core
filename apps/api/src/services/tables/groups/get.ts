import { GroupsModel } from 'src/services/models'
import { Group } from '../types'

export const getGroupInfo = async (groupId: number): Promise<Group | null> =>
    await GroupsModel.findOne({
      where: {
        id: groupId
      }
    }) as unknown as Group