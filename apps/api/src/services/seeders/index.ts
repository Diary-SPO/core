import { SocialTypeModel } from "../models/socialType"
import { seedSocialType } from "./socialType"

export const seedDatabase = async () => {
  // Записываем социальные сети
  if (await SocialTypeModel.count() == 0) {
    console.log("Seeding Socials to database ...")
    await seedSocialType()
  }
}