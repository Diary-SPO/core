import type { ICacheData } from '@helpers'
import { AdsModel } from '@models'

export const adsGetFromDB = async (authData: ICacheData) =>
  AdsModel.findAll({
    where: {
      spoId: authData.spoId
    },
    attributes: {
      exclude: ['id', 'spoId', 'idFromDiary'],
      include: [['idFromDiary', 'id']]
    },
    order: [['date', 'DESC']]
  })
