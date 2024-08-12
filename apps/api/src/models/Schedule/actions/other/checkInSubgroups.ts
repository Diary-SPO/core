import type { IScheduleSubgroupModelType } from '../../../ScheduleSubgroup'

export const checkInSubgroups = (
  subgroups: IScheduleSubgroupModelType[],
  localUserId: bigint
) => {
  for (const subgroup of subgroups) {
    if (subgroup.diaryUserId === localUserId) {
      return true
    }
  }

  return false
}
