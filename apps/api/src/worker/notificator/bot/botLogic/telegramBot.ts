import { BOT_TOKEN } from '@config'
import { Telegram } from 'puregram'
import { registerLogic } from './registerLogic'

const token = BOT_TOKEN

export const bot =
  Bun.main.includes('main.ts') || token === 'IGNORE'
    ? null
    : Telegram.fromToken(token, {
        apiRetryLimit: -1
      })

if (bot) {
  bot.onError((err) => {
    console.error('ОЧЕНЬ СТРАШНАЯ ОШИБКА В PUREGRAM:', err)
    return err
  })
  registerLogic(bot)
  bot.updates.startPolling()
}
