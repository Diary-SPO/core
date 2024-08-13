import { DataTypes } from 'sequelize'

import { sequelize } from '@db'

import { ScheduleModel } from '../Schedule'
import { TaskTypeModel } from '../TaskType'
import type { IModelPrototype } from '../types'

export type TaskModelType = {
  id: bigint
  scheduleId: bigint
  taskTypeId: number
  topic: string
  idFromDiary: number
}

export type ITaskModel = IModelPrototype<TaskModelType, 'id'>

export const TaskModel = sequelize.define<ITaskModel>('task', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  scheduleId: {
    type: DataTypes.BIGINT,
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
