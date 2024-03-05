import { cache, enableCache, sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { IModelPrototype } from '../types'

export type TermTypeModelType = {
  id: number
  name: string
}

export type ITermTypeModel = IModelPrototype<TermTypeModelType, 'id'>

const termTypeModel = sequelize.define<ITermTypeModel>('termType', {
  id: {
    type: DataTypes.INTEGER,
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
