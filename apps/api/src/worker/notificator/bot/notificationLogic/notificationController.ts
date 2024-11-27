import type { MarkEvent } from '../../types/MarkEvent'
import { sendMarkEvent } from './sendMarkEvent'

/**
 * Регистрирует событие взаимодействия с оценкой
 * @param event
 */
export const addNewMarkEvent = async (event: MarkEvent): Promise<void> => {
  await sendMarkEvent(event)
}

// comment: все события описываются здесь
// напиример, пока что тут только событие на оценки (но в будущем будет и на расписание)
