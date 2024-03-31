import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { ScheduleModel } from '../Schedule'
import { TaskTypeModel } from '../TaskType'
import { IModelPrototype } from '../types'

export type TaskModelType = {
  id: number
  scheduleId: number
  taskTypeId: number
  topic: string
  idFromDiary: number
}

export type ITaskModel = IModelPrototype<TaskModelType, 'id'>

export const TaskModel = sequelize.define<ITaskModel>('task', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  scheduleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: 'task_unique_k',
    references: {
      model: ScheduleModel,
      key: 'id'
    }
  },
  taskTypeId: {
    type: DataTypes.SMALLINT,
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
    allowNull: false,
    unique: 'task_unique_k'
  }
})
