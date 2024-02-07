import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { DiaryUserModel } from './diaryUser'
import { TaskModel } from './task'
import { IModelPrototype } from './types'

export type RequiredsModelType = {
  id: number
  diaryUserId: number
  taskId: number
  isRequired: boolean
}

export type IRequiredsModel = IModelPrototype<RequiredsModelType, 'id'>

export const RequiredsModel = sequelize.define<IRequiredsModel>(
  'requireds',
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
    isRequired: {
      type: DataTypes.BOOLEAN,
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
