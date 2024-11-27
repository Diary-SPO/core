import { BOT_TOKEN } from '@config'
import { registerLogic } from './registerLogic'
import {Telegram} from "puregram";

const token = BOT_TOKEN

export const bot =
  Bun.main.includes('main.ts') || token === 'IGNORE'
    ? null
    : Telegram.fromToken(token)

if (bot) {
    registerLogic(bot)
    bot.updates.startPolling()
}
