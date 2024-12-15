import {API_HASH, API_ID, BOT_TOKEN} from '@config'
import { registerLogic } from './registerLogic'
import {TelegramClient} from "@mtcute/bun";
import {Dispatcher} from "@mtcute/dispatcher";

const token = BOT_TOKEN

let bot: null|TelegramClient = null

// Подключаем бота, только если мы в воркере
if (Bun.main.includes('worker') && token !== 'IGNORE') {
  const tg = new TelegramClient({
    apiId: API_ID,
    apiHash: API_HASH
  })

  const dp = Dispatcher.for(tg)

  // Регистрируем команды к боту, на которые отвечаем
  registerLogic(dp)

  // Запускаем бота
  await tg.start({
    botToken: BOT_TOKEN
  })

  bot = tg
}

export { bot }
