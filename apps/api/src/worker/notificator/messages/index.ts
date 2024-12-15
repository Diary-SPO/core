import type { EventDetailedInfo } from '../types/EventDetailedInfo'
import { buildAddMarkMessage } from './templates/addMark'
import { buildDeleteMarkMessage } from './templates/deleteMark'
import { buildUpdateMarkMessage } from './templates/updateMark'

const messages = {
  ADD: buildAddMarkMessage,
  DELETE: buildDeleteMarkMessage,
  UPDATE: buildUpdateMarkMessage
}

export const buildMessageByEvent = (info: EventDetailedInfo) =>
  messages[info.status](info)

export * from './helpers'

// export const sendMarkEvent = async (event: MarkEvent) => {
//   const subscribe = await SubscribeModel.findOne({
//     where: {
//       diaryUserId: event.diaryUserId
//     }
//   })
//
//   if (!subscribe) return
//
//   let message = ''
//
//   switch (event.status) {
//     case 'ADD':
//       message += 'НОВАЯ ОЦЕНКА!'
//       break
//     case 'UPDATE':
//       message += 'ВАМ ИЗМЕНИЛИ ОЦЕНКУ!'
//       break
//     case 'DELETE':
//       message += 'ВАМ УБРАЛИ ОЦЕНКУ!'
//       break
//   }
//
//   const task = await TaskModel.findOne({
//     where: {
//       idFromDiary: event.task.id
//     }
//   })
//
//   if (!task) return
//
//   const schedule = await ScheduleModel.findOne({
//     where: {
//       id: task.scheduleId
//     }
//   })
//
//   if (!schedule || !schedule?.subjectId) return
//
//   const subject = await SubjectModel.findOne({
//     where: {
//       id: schedule.subjectId
//     }
//   })
//
//   if (!subject) return
//
//   const previousMark = event.previousMarkId
//     ? await MarkValueModel.findOne({
//         where: {
//           id: event.previousMarkId
//         }
//       })
//     : null
//
//   message += `
//   Оценка: ${Grade[event.mark] + (previousMark ? ` (предыдущая ${Grade[previousMark.value]})` : '')},
//   Предмет: ${subject.name} (дата: ${schedule.date})
//
//   Задание
//   Тема: ${event.task.topic ?? '[НЕ ЗАДАНО]'}
//   Описание: ${event.task.condition ?? '[НЕ ЗАДАНО]'}
//
//   Время обнаружения: ${event.eventDatetime.toUTCString()}
//   `
//
//   bot.sendMessage(String(subscribe.tgId), message)
// }
