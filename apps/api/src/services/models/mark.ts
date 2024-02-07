import { sequelize } from '@db'
import { MarkKeys } from '@diary-spo/shared'
import { DataTypes } from 'sequelize'
import { DiaryUserModel } from './diaryUser'
import { TaskModel } from './task'
import { IModelPrototype } from './types'

export type MarkModelType = {
  id: number
  diaryUserId: number
  taskId: number
  value: MarkKeys
}

export type IMarkModelType = IModelPrototype<MarkModelType, 'id'>

export const MarkModel = sequelize.define<IMarkModelType>(
  'mark',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    diaryUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: DiaryUserModel,
        key: 'id'
      }
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: TaskModel,
        key: 'id'
      }
    },
    value: {
      type: DataTypes.ENUM('Five', 'Four', 'Three', 'Two', ''),
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false
  }
)
