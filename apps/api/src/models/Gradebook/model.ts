import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { LessonTypeModel, AbsenceTypeModel } from '@models'
import { IModelPrototype } from '../types'

export type GradebookModelType = {
  id: number
  lessonTypeId: number
  idFromDiary: number
  absenceTypeId?: number
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
    lessonTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: LessonTypeModel,
        key: 'id'
      }
    },
    idFromDiary: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    absenceTypeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: AbsenceTypeModel,
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
