import {
  DiaryUserModel,
  type DiaryUserModelType,
  GroupModel,
  type GroupModelType
} from '@models'

export type IUserInfo = DiaryUserModelType & { group?: GroupModelType }

// не используется нигде
export const getUserById = async (
  id: bigint,
  getGroup = false
): Promise<IUserInfo | null> =>
  DiaryUserModel.findOne({
    where: {
      id
    },
    include: getGroup ? GroupModel : undefined
  })
