import { BOT_TOKEN } from '@config'
import TelegramBot from 'node-telegram-bot-api'

const token = BOT_TOKEN

export const bot = new TelegramBot(token, { polling: true })
