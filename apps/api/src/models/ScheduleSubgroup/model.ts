import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { DiaryUserModel } from '../DiaryUser'
import { ScheduleModel } from '../Schedule'
import { SubgroupModel } from '../Subgroup'
import type { IModelPrototypeNoId } from '../types'

export type ScheduleSubgroupModelType = {
  scheduleId: bigint
  diaryUserId: bigint
  subgroupId: bigint
}

export type IScheduleSubgroupModelType =
  IModelPrototypeNoId<ScheduleSubgroupModelType>

export const ScheduleSubgroupModel =
  sequelize.define<IScheduleSubgroupModelType>('scheduleSubgroup', {
    scheduleId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      references: {
        model: ScheduleModel,
        key: 'id'
      },
      unique: 'scheduleSubgroup_unique'
    },
    diaryUserId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      references: {
        model: DiaryUserModel,
        key: 'id'
      },
      unique: 'scheduleSubgroup_unique'
    },
    subgroupId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      references: {
        model: SubgroupModel,
        key: 'id'
      }
    }
  })
