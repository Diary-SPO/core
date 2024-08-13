import type { ICacheData } from '@helpers'

import { TermModel } from '../../../Term'
import { TermUserModel } from '../../model'

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
