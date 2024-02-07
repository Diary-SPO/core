import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { IModelPrototype } from './types'

export type LessonTypeModelType = {
  id: number
  name: string
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
