import { INotificationDetailedModel } from '@models'
import { ISocialStepTypeModel } from '@models'
import { ISocialTypeModel } from '@models'

export type INotificationsList = ISocialTypeModel & {
  steps: ISocialStepTypeModel[]
  isSubscription: boolean
}

export type INotificationStatus = {
  title: string
  code: string
  isSubscription: boolean
}

export type INotificationInfo = {
  socials: INotificationsList[]
  notificationsStatuses: INotificationStatus[]
}
