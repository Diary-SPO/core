import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { GradebookModel } from '../Gradebook'
import { TaskTypeModel } from '../TaskType'
import { IModelPrototype } from '../types'

export type TaskModelType = {
  id: number
  gradebookId: number
  taskTypeId: number
  topic: string
  idFromDiary: number
}

export type ITaskModel = IModelPrototype<TaskModelType, 'id'>

export const TaskModel = sequelize.define<ITaskModel>(
  'task',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    gradebookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: GradebookModel,
        key: 'id'
      }
    },
    taskTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: TaskTypeModel,
        key: 'id'
      }
    },
    topic: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    idFromDiary: {
      type: DataTypes.INTEGER,
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
