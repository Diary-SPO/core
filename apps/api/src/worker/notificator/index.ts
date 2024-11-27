import { getCookieFromToken } from '@helpers'
import { getMarkEvent } from '../../helpers/notificationController'
import { AuthModel } from '../../models/Auth'
import { DiaryUserModel } from '../../models/DiaryUser'
import { SubscribeModel } from '../../models/Subscribe'
import { getCurrPerformance } from '../../routes/performance.current/service'
import { checkInterval } from '../utils/checkInterval'
import { logger } from '../utils/logger'
import { INTERVAL_RUN } from './config'
import { sendEvent } from './messages'

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

    await getCurrPerformance(cacheData, true)
  }

  let markEvent = getMarkEvent()
  console.log(markEvent)

  while (markEvent) {
    await sendEvent(markEvent)
    // Запрашиваем следующие событие
    markEvent = getMarkEvent()
  }
}
