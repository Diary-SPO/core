import { SubscriptionTypeModel } from '@models'

export const seedSubscriptionType = async () => {
  await SubscriptionTypeModel.bulkCreate([
    {
      title: 'Уведомления об изменении оценок',
      code: 'mark_notification'
    },
    {
      title: 'Уведомление об изменении расписания (текущий и следующий день)',
      code: 'schedule_notification_2_day'
    },
    {
      title: 'Уведомления о новых объявлениях',
      code: 'ads_notification'
    }
  ])
}
