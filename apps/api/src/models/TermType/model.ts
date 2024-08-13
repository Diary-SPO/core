import type { TermType } from '@diary-spo/shared'
import { DataTypes } from 'sequelize'

import { cache, enableCache, sequelize } from '@db'

import type { IModelPrototype } from '../types'

export type TermTypeModelType = {
  id: number
  name: TermType
}

export type ITermTypeModel = IModelPrototype<TermTypeModelType, 'id'>

const termTypeModel = sequelize.define<ITermTypeModel>('termType', {
  id: {
    type: DataTypes.SMALLINT,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
})

export const TermTypeModel = enableCache
  ? cache.init<ITermTypeModel>(termTypeModel)
  : termTypeModel
