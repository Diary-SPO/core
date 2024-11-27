import {EventDetailedInfo} from "../../../types/EventDetailedInfo";
import {getDayInfo} from "../../helpers";
import {getSmileByMarkValue} from "../../helpers";

export const buildDeleteMarkMessage = (info: EventDetailedInfo) => {
    const markValue = info.currentMark

    const dayInfo = getDayInfo(info)

    const subjectName = info.subject.name

    const emoji = getSmileByMarkValue(markValue)

    return `Убрана ${emoji} на ${dayInfo.day}.${dayInfo.month} (${dayInfo.dayName}) по ${subjectName}`
}