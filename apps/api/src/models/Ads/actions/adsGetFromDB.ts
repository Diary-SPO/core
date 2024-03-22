import { ICacheData } from '@helpers'
import { AdsModel } from '../model'

export const adsGetFromDB = async (authData: ICacheData) => {
  return AdsModel.findAll({
    where: {
      spoId: authData.spoId
    },
    attributes: {
      exclude: ['id', 'spoId', 'idFromDiary'],
      include: [['idFromDiary', 'id']]
    },
    order: [['date', 'DESC']]
  })
}
