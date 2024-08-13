import { DataTypes } from 'sequelize'

import { sequelize } from '@db'

import { SPOModel } from '../SPO'
import type { IModelPrototype } from '../types'

export type AdsModelType = {
  id: bigint
  spoId: bigint
  date: string | Date
  title: string
  text: string
  isForEmployees: boolean
  isForStudents: boolean
  isForParents: boolean
  shouldDeleteNews: boolean
  deleteInDays: number
  idFromDiary: number
  attachments?: string[]
}

export type IAdsModelType = IModelPrototype<AdsModelType, 'id'>

export const AdsModel = sequelize.define<IAdsModelType>('ads', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  spoId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: SPOModel
    },
    unique: 'ads_unique_k'
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  isForEmployees: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  isForStudents: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  isForParents: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  shouldDeleteNews: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  deleteInDays: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  idFromDiary: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: 'ads_unique_k'
  },
  attachments: {
    type: DataTypes.VIRTUAL,
    get() {
      return []
    },
    set() {
      throw new Error('No not try to set the `attachments` value!')
    }
  }
})
