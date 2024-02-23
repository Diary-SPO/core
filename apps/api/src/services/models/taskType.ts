import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { IModelPrototype } from './types'
import { LessonWorkType, LessonWorkTypeKeys } from '@diary-spo/shared'

export type TaskTypeModelType = {
  id: number
  name: LessonWorkTypeKeys
}

export type ITaskTypeModel = IModelPrototype<TaskTypeModelType, 'id'>

export const TaskTypeModel = sequelize.define<ITaskTypeModel>(
  'taskType',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(...Object.keys(LessonWorkType)),
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
