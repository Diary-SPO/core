import { INotificationDetailedModel } from 'src/services/models/notificationDetailed'
import { ISocialStepTypeModel } from 'src/services/models/socialStepType'
import { ISocialTypeModel } from 'src/services/models/socialType'

export type INotificationsList = ISocialTypeModel & {
  steps: ISocialStepTypeModel[]
  isSubscription: boolean | null
}
