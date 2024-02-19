import {
  DiaryUserModel,
  DiaryUserModelType,
  GroupModel,
  GroupModelType
} from '../models'
export type IUserInfo = DiaryUserModelType & { group: GroupModelType }

export const diaryUserGetFromId = async (id: number, getGroup = false) => {
  const record = (await DiaryUserModel.findOne({
    where: {
      idFromDiary: id
    },
    include: getGroup ? GroupModel : undefined
  })) as IUserInfo | null

  return record
}
