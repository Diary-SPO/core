import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { IModelPrototype } from './types'

export type TermTypeModelType = {
  id: number
  name: string
}

export type ITermTypeModel = IModelPrototype<TermTypeModelType, 'id'>

export const TermTypeModel = sequelize.define<ITermTypeModel>(
  'termType',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
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
