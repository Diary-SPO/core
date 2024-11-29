import { BOT_TOKEN } from '@config'
import { Telegram } from 'puregram'
import { registerLogic } from './registerLogic'

const token = BOT_TOKEN

let bot = null

// Подключаем бота, только если мы в воркере
if (Bun.main.includes('worker') && token !== 'IGNORE') {
  bot = Telegram.fromToken(token, {
    apiRetryLimit: -1
  })

  // Отлавливаем ошибки, если таковые имеются
  bot.onError((err) => {
    console.error('ОЧЕНЬ СТРАШНАЯ ОШИБКА В PUREGRAM:', err)
    return err
  })

  // Регистрируем команды к боту, на которые отвечаем
  registerLogic(bot)

  // Слушаем входящие сообщения
  bot.updates.startPolling()
}

export { bot }
