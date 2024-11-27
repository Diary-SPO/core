import { Grade } from '@diary-spo/shared'
import { getCookieFromToken } from '@helpers'
import { bot } from 'src/telegramBot'
import type { IMarkEvent } from '../../../helpers/notificationController'
import { DiaryUserModel } from '../../../models/DiaryUser'
import { MarkModel } from '../../../models/Mark'
import { MarkValueModel } from '../../../models/MarkValue'
import { ScheduleModel } from '../../../models/Schedule'
import { SubjectModel } from '../../../models/Subject'
import { SubscribeModel } from '../../../models/Subscribe'
import { TaskModel } from '../../../models/Task'

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
      const token = command[1]

      const auth = await getCookieFromToken(token).catch(() => null)

      if (!auth) {
        bot.sendMessage(chatId, 'Токен не найден ...')
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
          'Вы уже подписаны для других аккаунтов. Сначала отпишитесь от остальных (/unsubscribe)'
        )
        return
      }

      await SubscribeModel.create({
        diaryUserId: auth.localUserId,
        tgId: BigInt(chatId)
      })

      const user = await DiaryUserModel.findOne({
        where: {
          id: auth.localUserId
        }
      })

      bot.sendMessage(
        chatId,
        `Вы подписались на аккаунт c ФИО => ${user?.firstName} ${user?.lastName} ${user?.middleName}`
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
      bot.sendMessage(chatId, 'Такой команды нету')
      break
  }
})

export const sendEvent = async (event: IMarkEvent) => {
  const subscribe = await SubscribeModel.findOne({
    where: {
      diaryUserId: event.diaryUserId
    }
  })

  if (!subscribe) return

  let message = ''

  switch (event.status) {
    case 'ADD':
      message += 'НОВАЯ ОЦЕНКА!'
      break
    case 'UPDATE':
      message += 'ВАМ ИЗМЕНИЛИ ОЦЕНКУ!'
      break
    case 'DELETE':
      message += 'ВАМ УБРАЛИ ОЦЕНКУ!'
      break
  }

  const task = await TaskModel.findOne({
    where: {
      idFromDiary: event.task.id
    }
  })

  if (!task) return

  const schedule = await ScheduleModel.findOne({
    where: {
      id: task.scheduleId
    }
  })

  if (!schedule || !schedule?.subjectId) return

  const subject = await SubjectModel.findOne({
    where: {
      id: schedule.subjectId
    }
  })

  if (!subject) return

  const previousMark = event.previousMarkId
    ? await MarkValueModel.findOne({
        where: {
          id: event.previousMarkId
        }
      })
    : null

  message += `
  Оценка: ${Grade[event.mark] + (previousMark ? ` (предыдущая ${Grade[previousMark.value]})` : '')},
  Предмет: ${subject.name} (дата: ${schedule.date})
  
  Задание
  Тема: ${event.task.topic ?? '[НЕ ЗАДАНО]'}
  Описание: ${event.task.condition ?? '[НЕ ЗАДАНО]'}
  
  Время обнаружения: ${event.eventDatetime.toUTCString()}
  `

  bot.sendMessage(String(subscribe.tgId), message)
}
