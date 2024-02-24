import { cache, enableCache, sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { IModelPrototype } from './types'

export type LessonTypeModelType = {
  id: number
  name: string
}

export type ILessonTypeModel = IModelPrototype<LessonTypeModelType, 'id'>

const lessonTypeModel = sequelize.define<ILessonTypeModel>(
  'lessonType',
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

export const LessonTypeModel =  enableCache ? cache.init<ILessonTypeModel>(lessonTypeModel) : lessonTypeModel