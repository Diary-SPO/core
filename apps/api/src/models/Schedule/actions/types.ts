import { IScheduleSubgroupModelType } from "src/models/ScheduleSubgroup";
import { IScheduleModel } from "../model";

export type ScheduleSubgroupsGet = IScheduleModel & {
  scheduleSubgroups: IScheduleSubgroupModelType[]
}

export type ScheduleWhere = {
  groupId: number,
  startTime: string
  endTime: string
  date: Date | string
  subjectId?: number
}