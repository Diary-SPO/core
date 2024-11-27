// @ts-ignore
import { b64 } from '@diary-spo/crypto'
import type TelegramBot from 'node-telegram-bot-api'
import { AuthModel } from '../../../../models/Auth'
import { DiaryUserModel } from '../../../../models/DiaryUser'
import { SubscribeModel } from '../../../../models/Subscribe'
import { INTERVAL_RUN } from '../../config'

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

        // TODO: потом по-нормальному вынести
        let tokenSecure = ''
        try {
          tokenSecure = atob(command[1])
        } catch {
          bot.sendMessage(
            chatId,
            'Вы что-то не то шлёте и всё ломаете. В бан захотели?'
          )
          return
        }
        const secureTokenParams = tokenSecure.split(':')

        if (secureTokenParams.length !== 2 && !Number(secureTokenParams[0])) {
          bot.sendMessage(
            chatId,
            'У вашего токена неверная структура. В бан захотел(-а)?'
          )
          return
        }

        const auth = await AuthModel.findOne({
          where: {
            id: secureTokenParams[0]
          }
        })

        if (!auth) {
          bot.sendMessage(chatId, 'Переданная авторизация не найдена ...')
          return
        }

        // Проверяем переданную пользователем авторизацию
        const tokenObject = {
          token: auth.token,
          date: new Date().toISOString().substring(0, 10)
        }
        const secureToken = await b64(JSON.stringify(tokenObject))

        if (secureToken !== secureTokenParams[1]) {
          bot.sendMessage(
            chatId,
            `Ваш токен какой-то не такой. Если вы ничего не трогали, то проблема у нас.\nПожалуйста, покажите это сообщение разработчикам.\nDebug info: ${btoa(
              JSON.stringify({
                tokenSecure,
                currServerDate: new Date().toISOString()
              })
            )}`
          )
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
            'Вы уже подписаны на уведомления. Сначала отпишитесь (/unsubscribe)'
          )
          return
        }

        await SubscribeModel.create({
          diaryUserId: auth.diaryUserId,
          tgId: BigInt(chatId),
          preActionsIsSuccess: false
        })

        const user = await DiaryUserModel.findOne({
          where: {
            id: auth.diaryUserId
          }
        })

        bot.sendMessage(
          chatId,
          `<b><i>${user?.firstName} ${user?.lastName}!</i></b> Вы успешно подписались на уведомления.\nПрежде чем Вы начнёте получать уведомления, нам нужно извлечь все ваши оценки (это просиходит примерно каждые <b>${INTERVAL_RUN} секунд</b>).\nПо окончанию подготовительных процедур, мы уведомим Вас о готовности принимать уведомления.\nСпасибо, что выбираете нас!`,
          { parse_mode: 'HTML' }
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
        bot.sendMessage(
          chatId,
          'Этой команды нету, но есть такие:' +
            '\n/subscribe <code>[token]</code> — подписаться на уведомления по токену' +
            '\n/unsubscribe — отписаться от уведомлений',
          { parse_mode: 'HTML' }
        )
        break
    }
  })
}
