import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import type { IModelPrototype } from '../types'

export type SPOModelType = {
  id: number
  abbreviation: string
  name: string
  shortName: string
  actualAddress: string
  email: string
  site: string
  phone: string
  type: string
  directorName: string
  organizationId: string
}

export type ISPOModel = IModelPrototype<SPOModelType, 'id'>

export const SPOModel = sequelize.define<ISPOModel>('spo', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  abbreviation: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  shortName: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  actualAddress: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  site: {
    type: DataTypes.STRING(75),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(25),
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  directorName: {
    type: DataTypes.STRING(85),
    allowNull: false
  },
  organizationId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
})
