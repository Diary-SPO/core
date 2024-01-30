import { client } from '@db'
import createQueryBuilder from '@diary-spo/sql'
import { DBSchedule } from '../../../types/databaseTypes'

export const removeScheduleForList = async (
  scheduleList: DBSchedule[],
  subgroup: boolean | string,
  groupId: number,
  currDate: string
): Promise<void> => {
  const idListString = scheduleList
    .map((schedule) => {
      return schedule.id
    })
    .join(', ')

  await createQueryBuilder<DBSchedule>(client)
    .from('schedule')
    .where(
      `id NOT IN (${idListString})` +
        ` and date = '${currDate}'` +
        ` and "groupId" = ${groupId}` +
        (subgroup
          ? ` and ("subjectName" NOT LIKE '%/%' or "subjectName" LIKE '%${subgroup}%')`
          : '')
    )
    .delete()
}
