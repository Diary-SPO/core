import { Op } from 'sequelize'
import { ScheduleModel } from 'src/services/models'
import { DBSchedule } from '../../../types/databaseTypes'

export const removeScheduleForList = async (
  scheduleList: DBSchedule[],
  subgroup: boolean | string,
  groupId: number,
  currDate: string
): Promise<void> => {
  const idList = scheduleList
    .map((schedule) => {
      return schedule.id
    })
    .join(',')
    .split(',') // Тут что-то не то написал, исправить! TODO!

  // TODO! Работает правильно, но запрос не тот, который я хотел. Для красоты лучше переделать (рефакторинг)
  /** Этот же запрос на SQL (случай отсутствия subgroup, т.е. раного false):
   * DELETE FROM "schedule" WHERE
   * (
   *  ("subjectName" NOT LIKE '%' OR "subjectName" LIKE '%false%')
   *  AND "id" NOT IN ('188', '189', '190', '173')
   *  AND "date" = '2024-01-10' AND "groupId" = 104
   * )
   */
  await ScheduleModel.destroy({
    where: {
      [Op.and]: {
        id: {
          [Op.notIn]: idList
        },
        date: currDate,
        groupId: groupId,
        [Op.or]: [
          {
            subjectName: {
              [Op.notLike]: subgroup ? '%/%' : '%'
            }
          },
          {
            subjectName: {
              [Op.like]: `%${subgroup}%`
            }
          }
        ]
      }
    }
  })
}
