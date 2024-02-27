import { ICacheData } from '@db'
import { INotificationsList } from './type'
import { SubscriptionTypeModel } from '../../database/models/subscriptionType'
import { SubscriptionModel } from '../../database/models/subscription'

export const userSubscriptions = async (
  list: INotificationsList[],
  userInfo: ICacheData
) => {
  const subscriptionTypes = await SubscriptionTypeModel.findAll({
    include: {
      model: SubscriptionModel,
      where: {
        diaryUserId: userInfo.localUserId
      },
      required: false
    }
  })
  console.log(JSON.stringify(subscriptionTypes, null, 2))
}
