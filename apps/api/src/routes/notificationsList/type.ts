import { INotificationDetailedModel } from '../../database/models/notificationDetailed'
import { ISocialStepTypeModel } from '../../database/models/socialStepType'
import { ISocialTypeModel } from '../../database/models/socialType'

export type INotificationsList = ISocialTypeModel & {
  steps: ISocialStepTypeModel[]
  isSubscription: boolean | null
}
