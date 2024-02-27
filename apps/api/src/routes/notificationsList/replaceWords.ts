import { ICacheData } from '@helpers'
import { INotificationsList } from './type'

export const replaceWords = (
  list: INotificationsList[],
  userInfo: ICacheData,
  secret: string
) => {
  for (const social of list) {
    for (const step of social.steps) {
      step.value = step.value
        ?.replaceAll('{authToken}', secret)
        ?.replaceAll('{localId}', String(userInfo.localUserId))
        ?.replaceAll('{diaryId}', String(userInfo.idFromDiary))
      if (step.value === '') {
        step.value = undefined
      }
    }
    social.steps.sort((a, b) => (a.step > b.step ? 1 : -1))
  }
}
