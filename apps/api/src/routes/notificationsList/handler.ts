import { getCookieFromToken } from '@db'
import type { NotificationsResponse } from '@diary-spo/shared'
import { ContextWithID } from '@types'
import { NotificationDetailedModel } from 'src/services/models/notificationDetailed'
import { SocialStepTypeModel } from 'src/services/models/socialStepType'
import { SocialTypeModel } from 'src/services/models/socialType'
import { INotificationsList } from './type'
import { replaceWords } from './replaceWords'
import { userActivated } from './userActivated'

const notificationListHandler = async ({
  request
}: ContextWithID): Promise<NotificationsResponse | {}> => {
  const secret = request.headers.toJSON().secret
  const authData = await getCookieFromToken(secret)

  let socials = await SocialTypeModel.findAll({
    include: 
    [
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
  }) as INotificationsList[]

  socials = JSON.parse(JSON.stringify(socials))

  if (!socials) {
    return []
  }

  //socials = socials.toArray()

  await replaceWords(socials, authData, secret)
  await userActivated(socials, authData)

  return JSON.stringify(socials)
}

export default notificationListHandler
