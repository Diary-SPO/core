import { ICacheData } from '@helpers'
import { NotificationDetailedModel } from '@models'
import { INotificationsList } from './type'

export const userActivated = async (
  list: INotificationsList[],
  userInfo: ICacheData
) => {
  for (const n of list) {
    const user = await NotificationDetailedModel.findOne({
      where: {
        diaryUserId: userInfo.localUserId,
        socialTypeId: n.id
      }
    })

    const isSubscription = !!user

    n.isSubscription = isSubscription
  }
}
