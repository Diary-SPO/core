import type { EventDetailedInfo } from '../../../types/EventDetailedInfo'
import { getDayInfo } from '../../helpers'
import { getSmileByMarkValue } from '../../helpers'

export const buildAddMarkMessage = (info: EventDetailedInfo) => {
  const markValue = info.currentMark

  const dayInfo = getDayInfo(info)

  const subjectName = info.subject.name

  const emoji = getSmileByMarkValue(markValue)

  return `${emoji} на ${dayInfo.day}.${dayInfo.month} (${dayInfo.dayName}) по ${subjectName}`
}
