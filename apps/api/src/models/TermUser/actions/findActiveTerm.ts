import { ICacheData } from '@helpers'
import { TermModel } from 'src/models/import'
import { TermUserModel } from '../model'

export const findActiveTerm = async (authData: ICacheData) => {
  return (
    await TermUserModel.findOne({
      where: {
        diaryUserId: authData.localUserId
      },
      include: {
        model: TermModel,
        where: {
          isActive: true
        },
        required: true
      }
    })
  )?.termId
}
