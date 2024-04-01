import { LessonType, type LessonTypeKeys } from '@diary-spo/shared'
import { DataTypes } from 'sequelize'

import { cache, enableCache, sequelize } from '@db'

import type { IModelPrototype } from '../types'

export type LessonTypeModelType = {
  id: number
  name: LessonTypeKeys
}

export type ILessonTypeModel = IModelPrototype<LessonTypeModelType, 'id'>

const lessonTypeModel = sequelize.define<ILessonTypeModel>('lessonType', {
  id: {
    type: DataTypes.SMALLINT,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.ENUM(...Object.keys(LessonType)),
    allowNull: false,
    unique: true
  }
})

export const LessonTypeModel = enableCache
  ? cache.init<ILessonTypeModel>(lessonTypeModel)
  : lessonTypeModel
