import { cache, enableCache, sequelize } from '@db'
import { LessonWorkType, LessonWorkTypeKeys } from '@diary-spo/shared'
import { DataTypes } from 'sequelize'
import { IModelPrototype } from '../types'

export type TaskTypeModelType = {
  id: number
  name: LessonWorkTypeKeys
}

export type ITaskTypeModel = IModelPrototype<TaskTypeModelType, 'id'>

const taskTypeModel = sequelize.define<ITaskTypeModel>('taskType', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(...Object.keys(LessonWorkType)),
    allowNull: false,
    unique: true
  }
})

export const TaskTypeModel = enableCache
  ? cache.init<ITaskTypeModel>(taskTypeModel)
  : taskTypeModel