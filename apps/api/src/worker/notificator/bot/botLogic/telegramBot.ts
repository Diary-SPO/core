import { BOT_TOKEN } from '@config'
import TelegramBot from 'node-telegram-bot-api'
import {registerLogic} from "./registerLogic"

const token = BOT_TOKEN

export const bot = Bun.main.includes('main.ts') || token == 'IGNORE'
    ? null
    : new TelegramBot(token, { polling: true })

if (bot)
    registerLogic(bot)