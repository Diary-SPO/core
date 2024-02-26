import { SocialTypeModel } from "../models/socialType"
import { seedSocialStepType } from "./socialStepType"

export const seedSocialType = async () => {
  const telegram = await SocialTypeModel.create({
    name: "Telegram",
    description: "Bot #1",
    token: "empty",
    isActive: true // TODO: после создания админке поменять на false
  })
  await seedSocialStepType([
    {
      socialTypeId: telegram.id,
      step: 1,
      title: "Скопируйте Ваш уникальный токен",
      description: "Нажмите на кнопку ниже, чтобы скопировать уникальный токен от Вашей учётной записи в дневнике. "
      + "Никому его не передавайте.",
      value: "{authToken}",
      toCopy: true,
      toLink: false
    },
    {
      socialTypeId: telegram.id,
      step: 2,
      title: "Перейдите в бота",
      description: "Нажмите на кнопку ниже. У Вас откроет telegram-бот. Просто отправьте ему скопированный выше токен.",
      value: "https://t.me/myBotName",
      toCopy: false,
      toLink: true
    },
    {
      socialTypeId: telegram.id,
      step: 3,
      title: "Готово!",
      description: "Если бот ответил Вам со словами, что ваша учётная запись успешно привязана"
      + ", то Вы можете пользоваться уведомлениями.",
      value: "",
      toCopy: true,
      toLink: false
    }
  ])
}