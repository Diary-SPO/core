import { getCookieFromToken } from '@helpers'
import type TelegramBot from 'node-telegram-bot-api'
import { DiaryUserModel } from '../../../../models/DiaryUser'
import { SubscribeModel } from '../../../../models/Subscribe'

export const registerLogic = (bot: TelegramBot | null) => {
  if (!bot) return
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id

    if (!msg.text) bot.sendMessage(chatId, 'Такое сообщение не поддерживается')

    const command = (msg.text ?? '').split(' ')

    switch (command[0]) {
      case '/subscribe': {
        if (command.length < 2) {
          bot.sendMessage(
            chatId,
            'Передайте вторым параметром актуальный токен, чтобы подписаться на уведомления'
          )
          return
        }
        const token = command[1]

        const auth = await getCookieFromToken(token).catch(() => null)

        if (!auth) {
          bot.sendMessage(chatId, 'Токен не найден ...')
          return
        }

        const subscribes = await SubscribeModel.findAll({
          where: {
            tgId: chatId
          }
        })

        if (subscribes.length >= 1) {
          bot.sendMessage(
            chatId,
            'Вы уже подписаны для других аккаунтов. Сначала отпишитесь от остальных (/unsubscribe)'
          )
          return
        }

        await SubscribeModel.create({
          diaryUserId: auth.localUserId,
          tgId: BigInt(chatId)
        })

        const user = await DiaryUserModel.findOne({
          where: {
            id: auth.localUserId
          }
        })

        bot.sendMessage(
          chatId,
          `Вы подписались на аккаунт c ФИО => ${user?.firstName} ${user?.lastName} ${user?.middleName}`
        )
        break
      }
      case '/unsubscribe':
        await SubscribeModel.destroy({
          where: {
            tgId: chatId
          }
        })
        bot.sendMessage(
          chatId,
          'Вы успешно отписались от всех аккаунтов. Можете привязать новый (/subscribe)'
        )
        break
      default:
        bot.sendMessage(chatId, 'Такой команды нету')
        break
    }
  })
}
