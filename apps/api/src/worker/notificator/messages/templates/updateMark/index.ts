import {EventDetailedInfo} from "../../../types/EventDetailedInfo";
import {getDayInfo} from "../../helpers";
import {getSmileByMarkValue} from "../../helpers";

export const buildUpdateMarkMessage = (info: EventDetailedInfo) => {
    const markValue = info.currentMark
    const previousMarkValue = info.previousMark

    if (!previousMarkValue)
        return null

    const dayInfo = getDayInfo(info)

    const subjectName = info.subject.name

    const emoji = getSmileByMarkValue(markValue)
    const previousEmoji = getSmileByMarkValue(previousMarkValue)

    return `${emoji} (было ${previousEmoji}) на ${dayInfo.day}.${dayInfo.month} (${dayInfo.dayName}) по ${subjectName}`
}