import type { NotificationsResponse } from '@diary-spo/shared'
import { AdsModel } from '../../model'

export const adsGetFromDB = async (
  spoId: bigint
): Promise<NotificationsResponse[]> =>
  (await AdsModel.findAll({
    where: {
      spoId: spoId
    },
    attributes: {
      exclude: ['id', 'spoId', 'idFromDiary'],
      include: [['idFromDiary', 'id']]
    },
    order: [['date', 'DESC']]
    //   @TODO: fixme
  })) as unknown as NotificationsResponse[]
