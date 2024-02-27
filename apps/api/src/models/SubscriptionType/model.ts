import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { IModelPrototype } from '../types'

export type SubscriptionTypeModelType = {
  id: number
  title: string
  code: string
}

export type ISubscriptionTypeModel = IModelPrototype<
  SubscriptionTypeModelType,
  'id'
>

export const SubscriptionTypeModel = sequelize.define<ISubscriptionTypeModel>(
  'subscriptionType',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code: {
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
