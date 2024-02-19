import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { IModelPrototype } from './types'

export type TaskTypeModelType = {
  id: number
  name: string
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
      type: DataTypes.STRING(25),
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