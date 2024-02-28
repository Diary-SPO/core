import { SocialTypeModel, SubscriptionTypeModel } from '@models'
import { seedSocialType } from './socialType'
import { seedSubscriptionType } from './subscriptionType'

export const seedDatabase = async () => {
  // Записываем социальные сети
  if ((await SocialTypeModel.count()) === 0) {
    console.log('Seeding Socials to database ...')
    await seedSocialType()
  }

  // Записываем типы уведомлений
  if ((await SubscriptionTypeModel.count()) === 0) {
    console.log('Seeding SubscriptionType to database ...')
    await seedSubscriptionType()
  }
}
