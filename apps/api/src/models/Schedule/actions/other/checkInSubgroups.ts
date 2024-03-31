import type { IScheduleSubgroupModelType } from '@models'

export const checkInSubgroups = (
  subgroups: IScheduleSubgroupModelType[],
  localUserId: number
) => {
  for (const subgroup of subgroups) {
    if (subgroup.diaryUserId === localUserId) {
      return true
    }
  }
  return false
}
