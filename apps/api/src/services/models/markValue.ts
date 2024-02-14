import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { IModelPrototype } from './types'

export type MarkValueModelType = {
  id: number
  value: string
}

export type IMarkValueModelType = IModelPrototype<MarkValueModelType, 'id'>

export const MarkValueModel = sequelize.define<IMarkValueModelType>(
  'markValue',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    value: {
      type: DataTypes.STRING(35),
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
