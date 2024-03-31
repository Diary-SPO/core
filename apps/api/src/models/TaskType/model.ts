import { cache, enableCache, sequelize } from '@db'
import { LessonWorkType, type LessonWorkTypeKeys } from '@diary-spo/shared'
import { DataTypes } from 'sequelize'
import type { IModelPrototype } from '../types'

export type TaskTypeModelType = {
  id: number
  name: LessonWorkTypeKeys
}

export type ITaskTypeModel = IModelPrototype<TaskTypeModelType, 'id'>

const taskTypeModel = sequelize.define<ITaskTypeModel>('taskType', {
  id: {
    type: DataTypes.SMALLINT,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.ENUM(...Object.keys(LessonWorkType)),
    allowNull: false,
    unique: true
  }
})

export const TaskTypeModel = enableCache
  ? cache.init<ITaskTypeModel>(taskTypeModel)
  : taskTypeModel
