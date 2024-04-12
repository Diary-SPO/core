import { DataTypes } from 'sequelize'

import { sequelize } from '@db'

import { ScheduleModel } from '../Schedule'
import type { IModelPrototype } from '../types'

export type ThemeModelType = {
  id: bigint
  scheduleId: bigint
  description: string
}

export type IThemeModelType = IModelPrototype<ThemeModelType, 'id'>

export const ThemeModel = sequelize.define<IThemeModelType>('theme', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  scheduleId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: ScheduleModel,
      key: 'id'
    },
    unique: 'theme_unique_k'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: 'theme_unique_k'
  }
})
