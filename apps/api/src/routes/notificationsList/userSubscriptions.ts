import { ICacheData } from '@helpers'
import { INotificationInfo } from './type'
import { SubscriptionTypeModel, SubscriptionModel, ISubscriptionTypeModel, ISubscriptionModel } from '@models'

type subscriptionsFromDB = ISubscriptionTypeModel & {subscriptions: ISubscriptionModel[]}

export const userSubscriptions = async (
  list: INotificationInfo,
  userInfo: ICacheData
) => {
  const subscriptionTypes = await SubscriptionTypeModel.findAll({
    include: {
      model: SubscriptionModel,
      where: {
        diaryUserId: userInfo.localUserId
      },
      required: false,
      limit: 1
    }
  }) as subscriptionsFromDB[]

  for (const subscriptionType of subscriptionTypes) {
    const isSubscription = subscriptionType.subscriptions?.[0]?.value ?? false
    list.notificationsStatuses.push({
      title: subscriptionType.title,
      code: subscriptionType.code,
      description: subscriptionType.description,
      isSubscription: isSubscription
    })
  }
}
