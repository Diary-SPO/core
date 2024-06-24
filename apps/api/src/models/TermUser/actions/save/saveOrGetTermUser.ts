import type { ICacheData } from '@helpers'
import { TermUserModel } from '../../model'

export const saveOrGetTermUser = async (termId: bigint, authData: ICacheData) =>
  TermUserModel.findOrCreate({
    where: {
      termId,
      diaryUserId: authData.localUserId
    }
  }).then((v) => v[0])
