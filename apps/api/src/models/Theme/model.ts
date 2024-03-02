import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { ScheduleModel } from '../Schedule'
import { IModelPrototype } from '../types'

export type ThemeModelType = {
  id: number
  scheduleId: number
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
    scheduleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ScheduleModel,
        key: 'id'
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }
)
