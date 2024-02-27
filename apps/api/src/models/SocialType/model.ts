import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { IModelPrototype } from '../types'

export type SocialTypeModelType = {
  id: number
  name: string
  description: string
  token: string
  isActive: boolean
}

export type ISocialTypeModel = IModelPrototype<SocialTypeModelType, 'id'>

export const SocialTypeModel = sequelize.define<ISocialTypeModel>(
  'socialType',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
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
