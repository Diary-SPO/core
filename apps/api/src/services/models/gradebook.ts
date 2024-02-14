import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { AbsenceTypeModel } from './absenceType'
import { LessonTypeModel } from './lessonType'
import { ScheduleModel } from './schedule'
import { IModelPrototype } from './types'

export type GradebookModelType = {
  id: number
  scheduleId: number
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
