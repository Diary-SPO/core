import {
  DiaryUserModel,
  DiaryUserModelType,
  GroupModel,
  GroupModelType
} from '@db'

export type IUserInfo = DiaryUserModelType & { group: GroupModelType }

export const getUserById = async (
  id: number,
  getGroup = false
): Promise<IUserInfo | null> => {
  return DiaryUserModel.findOne({
    where: {
      idFromDiary: id
    },
    include: getGroup ? GroupModel : undefined
  })
}
