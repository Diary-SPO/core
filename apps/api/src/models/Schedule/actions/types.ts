import { IScheduleModel, IScheduleSubgroupModelType } from '@models'

export type ScheduleSubgroupsGet = IScheduleModel & {
  scheduleSubgroups: IScheduleSubgroupModelType[]
}

export type ScheduleWhere = {
  groupId: number
  startTime: string
  endTime: string
  date: Date | string
  subjectId?: number
}
