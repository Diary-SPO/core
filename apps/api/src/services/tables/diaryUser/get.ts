import { DiaryUserModel, IDiaryUserModel } from '@db'
import { DiaryUser } from '../types'

export const getDiaryUser = async (userId: number): Promise<IDiaryUserModel | null> =>
  await DiaryUserModel.findOne({
    where: {
      id: userId
    }
  })