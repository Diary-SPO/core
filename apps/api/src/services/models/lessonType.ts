import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { IModelPrototype } from './types'
import { LessonType, LessonTypeKeys } from '@diary-spo/shared'

export type LessonTypeModelType = {
  id: number
  name: LessonTypeKeys
}

export type ILessonTypeModel = IModelPrototype<LessonTypeModelType, 'id'>

export const LessonTypeModel = sequelize.define<ILessonTypeModel>(
  'lessonType',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.ENUM(...Object.keys(LessonType)),
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
