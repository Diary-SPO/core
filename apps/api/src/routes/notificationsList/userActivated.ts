import { ICacheData } from '@helpers'
import { INotificationsList } from './type'
import { NotificationDetailedModel } from '@models'

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

    let isSubscription = !!user

    n.isSubscription = isSubscription
  }
}
