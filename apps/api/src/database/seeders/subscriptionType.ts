import { SubscriptionTypeModel } from '@models'

export const seedSubscriptionType = async () => {
  await SubscriptionTypeModel.bulkCreate([
    {
      title: 'Уведомления об оценках',
      description: 'Новые и изменённые',
      code: 'mark_notification'
    },
    {
      title: 'Уведомление об изменении расписания',
      description: 'Текущий и следующий день',
      code: 'schedule_notification_2_day'
    },
    {
      title: 'Уведомления о новых объявлениях',
      description: 'Только от вашего колледжа',
      code: 'ads_notification'
    }
  ])
}
