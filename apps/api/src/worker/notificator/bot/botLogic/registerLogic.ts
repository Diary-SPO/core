import { getCookieFromToken } from '@helpers'
import type TelegramBot from 'node-telegram-bot-api'
import { DiaryUserModel } from '../../../../models/DiaryUser'
import { SubscribeModel } from '../../../../models/Subscribe'
import {INTERVAL_RUN} from "../../config";

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
          tgId: BigInt(chatId),
          preActionsIsSuccess: false
        })

        const user = await DiaryUserModel.findOne({
          where: {
            id: auth.localUserId
          }
        })

        bot.sendMessage(
          chatId,
          `<b><i>${user?.firstName} ${user?.lastName}!</i></b> Вы успешно подписались на уведомления.`
          + `\nПрежде чем Вы начнёте получать уведомления, нам нужно извлечь все ваши оценки (это просиходит примерно каждые <b>${INTERVAL_RUN} секунд</b>).`
          + `\nПо окончанию подготовительных процедур, мы уведомим Вас о готовности принимать уведомления.`
          + `\nСпасибо, что выбираете нас!`,
            {parse_mode: 'HTML'}
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
        bot.sendMessage(chatId,
            `Этой команды нету, но есть такие:`
            + `\n/subscribe <code>[token]</code> — подписаться на уведомления по токену`
            + `\n/unsubscribe — отписаться от уведомлений`,
            {parse_mode:"HTML"}
        )
        break
    }
  })
}
