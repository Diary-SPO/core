import {
  DiaryUserModel,
  type DiaryUserModelType,
  GroupModel,
  type GroupModelType
} from '@models'

export type IUserInfo = DiaryUserModelType & { group?: GroupModelType }

export const getUserById = async (
  id: number,
  getGroup = false
): Promise<IUserInfo | null> => {
  // TODO: fix it
  return DiaryUserModel.findOne({
    where: {
      id
    },
    include: getGroup ? GroupModel : undefined
  })
}
