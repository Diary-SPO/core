import { formatDate } from '@utils'
import { AuthModel, IAuthModel } from '../../model'

export const authSaveUseDate = async (
  token: string,
  date: Date
): Promise<[affectedCount: number]> =>
  AuthModel.update({
    lastUsedDate: formatDate(date)
  },
    {
      where: {
        token
      }
    })