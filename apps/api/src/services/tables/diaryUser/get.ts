import { DiaryUserModel, IDiaryUserModel } from '@db'

export const getDiaryUser = async (
  userId: number
): Promise<IDiaryUserModel | null> =>
  await DiaryUserModel.findOne({
    where: {
      id: userId
    }
  })
