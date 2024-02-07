import { sequelize } from '@db'
import { DataTypes, Model, Optional } from 'sequelize'
import { LessonTypeModel } from './lessonType'
import { ScheduleModel } from './schedule'
import { IModelPrototype } from './types'

export type GradebookModelType = {
  id: number
  scheduleId: number
  lessonTypeId: number
}

export type IGradebookModel = IModelPrototype<GradebookModelType, 'id'>

export const GradebookModel = sequelize.define<IGradebookModel>(
  'gradebook',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    scheduleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ScheduleModel,
        key: 'id'
      }
    },
    lessonTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: LessonTypeModel,
        key: 'id'
      }
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false
  }
)
