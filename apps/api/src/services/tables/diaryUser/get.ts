import { DiaryUserModel } from '@db'
import { DiaryUser } from '../types'

export const getDiaryUser = async (userId: number): Promise<DiaryUser | null> =>
  await DiaryUserModel.findOne({
    where: {
      id: userId
    }
  }) as unknown as DiaryUser // TODO! Временное решение