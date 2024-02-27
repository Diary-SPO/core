import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { DiaryUserModel } from '../DiaryUser'
import { IModelPrototypeNoId } from '../types'
import { SubscriptionTypeModel } from '../SubscriptionType/model'

export type SubscriptionModelType = {
  diaryUserId: number
  subscriptionTypeId: number
  value: boolean
}

export type ISubscriptionModel = IModelPrototypeNoId<SubscriptionModelType>

export const SubscriptionModel = sequelize.define<ISubscriptionModel>(
  'subscription',
  {
    diaryUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: DiaryUserModel,
        key: 'id'
      }
    },
    subscriptionTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: SubscriptionTypeModel,
        key: 'id'
      }
    },
    value: {
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
