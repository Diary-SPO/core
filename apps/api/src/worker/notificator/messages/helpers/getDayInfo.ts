import {getWeekDay} from "./getWeekDay";
import {EventDetailedInfo} from "../../types/EventDetailedInfo";

export const getDayInfo = (info: EventDetailedInfo) => {
    const date    = new Date(info.schedule.date)
    const dayName = getWeekDay(date)
    const day     = `0${date.getUTCDate()}`.slice(-2)
    const month   = `0${date.getUTCMonth() + 1}`.slice(-2)

    return {
        dayName,
        day,
        month
    }
}