// @ts-ignore
import { b64 } from '@diary-spo/crypto'
import { AuthModel } from '../../../../models/Auth'
import { DiaryUserModel } from '../../../../models/DiaryUser'
import { SubscribeModel } from '../../../../models/Subscribe'
import { INTERVAL_RUN } from '../../config'
import {html, TelegramClient} from "@mtcute/bun";
import {Dispatcher} from "@mtcute/dispatcher";

export const registerLogic = (bot: Dispatcher<never> | null) => {
  if (!bot) return
  bot.onNewMessage(async (msg) => {
    const chatId = msg.chat.id

    console.log(`Входящее сообщение от ${msg.chat.id} (${msg.chat.username}): ${msg.text}`)

    if (!msg.text) {
      msg.answerText('Такое сообщение не поддерживается')
      return
    }

    const command = (msg.text ?? '').split(' ')

    switch (command[0]) {
      case '/subscribe': {
        if (command.length < 2) {
          msg.answerText(
            'Передайте вторым параметром актуальный токен, чтобы подписаться на уведомления'
          )
          return
        }

        // TODO: потом по-нормальному вынести
        let tokenSecure = ''
        try {
          tokenSecure = atob(command[1])
        } catch {
          msg.answerText('Вы что-то не то шлёте и всё ломаете. В бан захотели?')
          return
        }
        const secureTokenParams = tokenSecure.split(':')

        if (secureTokenParams.length !== 2 && !Number(secureTokenParams[0])) {
          msg.answerText('У вашего токена неверная структура. В бан захотел(-а)?')
          return
        }

        const auth = await AuthModel.findOne({
          where: {
            id: secureTokenParams[0]
          }
        })

        if (!auth) {
          msg.answerText('Переданная авторизация не найдена ...')
          return
        }

        // Проверяем переданную пользователем авторизацию
        const tokenObject = {
          token: auth.token,
          date: new Date().toISOString().substring(0, 10)
        }
        const secureToken = await b64(JSON.stringify(tokenObject))

        if (secureToken !== secureTokenParams[1]) {
          msg.answerText(
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
          msg.answerText(
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

        msg.answerText(
          html`<b><i>${user?.firstName} ${user?.lastName}!</i></b> Вы успешно подписались на уведомления.\nПрежде чем Вы начнёте получать уведомления, нам нужно извлечь все ваши оценки (это просиходит примерно каждые <b>${INTERVAL_RUN} секунд</b>).\nПо окончанию подготовительных процедур, мы уведомим Вас о готовности принимать уведомления.\nСпасибо, что выбираете нас!`
        )
        break
      }
      case '/unsubscribe':
        await SubscribeModel.destroy({
          where: {
            tgId: chatId
          }
        })
        msg.answerText(
          'Вы успешно отписались от всех аккаунтов. Можете привязать новый (/subscribe)'
        )
        break
      default:
        msg.answerText(
          html(`Этой команды нету, но есть такие:` +
            `<br>/subscribe <code>[token]</code> — подписаться на уведомления по токену` +
            `<br>/unsubscribe — отписаться от уведомлений`)
        )
        break
    }
  })
}
