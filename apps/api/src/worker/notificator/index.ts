import { getCookieFromToken } from '@helpers'
import { AuthModel } from '../../models/Auth'
import { SubscribeModel } from '../../models/Subscribe'
import { getCurrPerformance } from '../../routes/performance.current/service'
import { checkInterval } from '../utils/checkInterval'
import { logger } from '../utils/logger'
import { INTERVAL_RUN } from './config'
import {bot} from "./bot";

let lastRunning: Date | null = null
const log = logger('notificator')

export const notificatorChecker = async (): Promise<void> => {
  if (lastRunning && !checkInterval(lastRunning, INTERVAL_RUN)) {
    return
  }

  lastRunning = new Date()

  log(`Запускаю обработчика уведомлений... ${new Date().toISOString()}`)

  // TODO: извлекать только подписчиков
  const subscribes = await SubscribeModel.findAll() // Извлекаем всех юзеров

  for (const subscribe of subscribes) {
    const auth = await AuthModel.findOne({
      where: {
        diaryUserId: subscribe.diaryUserId
      }
    })

    if (!auth) continue

    const cacheData = await getCookieFromToken(auth.token)

    if (!subscribe.preActionsIsSuccess) {
      getCurrPerformance(cacheData, false).then(() => {
        if (!bot)
          return
        subscribe.preActionsIsSuccess = true
        subscribe.save()
        bot.sendMessage(String(subscribe.tgId), `Мы загрузили ваши оценки. Теперь вы будете получать уведомления!`)
      })
      continue
    }

    await getCurrPerformance(cacheData, true)
  }
  log(`Проход завершён. Следующий через ${INTERVAL_RUN} секунд`)
}
