import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { GradebookModel } from '../Gradebook'
import { IModelPrototype } from '../types'

export type ThemeModelType = {
  id: number
  gradebookId: number
  description: string
}

export type IThemeModelType = IModelPrototype<ThemeModelType, 'id'>

export const ThemeModel = sequelize.define<IThemeModelType>(
  'theme',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    gradebookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: GradebookModel,
        key: 'id'
      }
    },
    description: {
      type: DataTypes.TEXT,
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
