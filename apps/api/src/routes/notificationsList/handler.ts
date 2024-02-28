import type { NotificationsResponse } from '@diary-spo/shared'
import { ContextWithID, INotificationInfo, INotificationsList } from '@types'
import { SocialStepTypeModel, SocialTypeModel } from '@models'
import { userActivated } from './userActivated'
import { userSubscriptions } from './userSubscriptions'
import { getCookieFromToken } from '@helpers'}

const notificationListHandler = async ({
  request
}: ContextWithID): Promise<NotificationsResponse | {}> => {
  const secret = request.headers.toJSON().secret
  const authData = await getCookieFromToken(secret)

  let socials = (await SocialTypeModel.findAll({
    include: [
      {
        model: SocialStepTypeModel,
        as: 'steps',
        attributes: {
          exclude: ['id', 'socialTypeId']
        }
      }
    ],
    attributes: {
      exclude: ['token']
    }
    // TODO: fix it
  })) as INotificationsList[]

  socials = JSON.parse(JSON.stringify(socials))

  const notificationsInfo: INotificationInfo = {
    socials,
    notificationsStatuses: []
  }

  if (!socials) {
    return []
  }

  replaceWords(notificationsInfo.socials, authData, secret)
  await userActivated(notificationsInfo.socials, authData)
  await userSubscriptions(notificationsInfo, authData)

  return JSON.stringify(notificationsInfo)
}

export default notificationListHandler
