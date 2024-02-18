import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { IModelPrototypeNoId } from './types'

export type ScheduleSubgroupModelType = {
  scheduleId: number
  diaryUserId: number
  subgroupId: number
}

export type IScheduleSubgroupModelType = IModelPrototypeNoId<ScheduleSubgroupModelType>

export const ScheduleSubgroupModel = sequelize.define<IScheduleSubgroupModelType>(
  'scheduleSubgroup',
  {
    scheduleId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model:'schedule',
        key: 'id'
      }
    },
    diaryUserId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model:'diaryUser',
        key: 'id'
      }
    },
    subgroupId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model:'subgroup',
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
