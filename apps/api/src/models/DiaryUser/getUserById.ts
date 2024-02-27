import {
  DiaryUserModel,
  DiaryUserModelType,
  GroupModel,
  GroupModelType
} from '@models'

export type IUserInfo = DiaryUserModelType & { group?: GroupModelType }

export const getUserById = async (
  id: number,
  getGroup = false
): Promise<IUserInfo | null> => {
  // TODO: fix it
  return DiaryUserModel.findOne({
    where: {
      idFromDiary: id
    },
    include: getGroup ? GroupModel : undefined
  })
}
