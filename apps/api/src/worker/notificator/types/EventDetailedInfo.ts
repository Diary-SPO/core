import {IScheduleModel} from "../../../models/Schedule";
import {ITaskModel} from "../../../models/Task";
import {ISubjectModelType} from "../../../models/Subject";
import {type AdditionalMarks} from "@diary-spo/shared";

export interface EventDetailedInfo {
    // Информация об источнике события
    subject: ISubjectModelType
    schedule: IScheduleModel
    task: ITaskModel
    // Информация об изменениях
    previousMark: AdditionalMarks | number | null
    currentMark: AdditionalMarks | number
    status: "ADD" | "DELETE" | "UPDATE"
    // Доп. инфа
    eventDatetime: Date
}