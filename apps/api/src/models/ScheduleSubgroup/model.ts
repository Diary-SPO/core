import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { DiaryUserModel } from '../DiaryUser'
import { ScheduleModel } from '../Schedule'
import { SubgroupModel } from '../Subgroup'
import { IModelPrototypeNoId } from '../types'

export type ScheduleSubgroupModelType = {
  scheduleId: number
  diaryUserId: number
  subgroupId: number
}

export type IScheduleSubgroupModelType =
  IModelPrototypeNoId<ScheduleSubgroupModelType>

export const ScheduleSubgroupModel =
  sequelize.define<IScheduleSubgroupModelType>(
    'scheduleSubgroup',
    {
      scheduleId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: ScheduleModel,
          key: 'id'
        },
        unique: 'scheduleSubgroup_unique'
      },
      diaryUserId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: DiaryUserModel,
          key: 'id'
        },
        unique: 'scheduleSubgroup_unique'
      },
      subgroupId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: SubgroupModel,
          key: 'id'
        }
      }
    },
    {
      freezeTableName: true,
      timestamps: false,
      createdAt: false,
      updatedAt: false
    }
  )
