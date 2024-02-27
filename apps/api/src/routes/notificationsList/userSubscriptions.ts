import { ICacheData } from '@helpers'
import { INotificationsList } from './type'
import { SubscriptionTypeModel } from '@models'
import { SubscriptionModel } from '@models'

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
