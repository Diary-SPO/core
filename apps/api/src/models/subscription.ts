import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { DiaryUserModel } from './DiaryUser'
import { IModelPrototypeNoId } from './types'
import { SubscriptionTypeModel } from './subscriptionType'

export type SubscriptionModelType = {
  diaryUserId: number
  subscriptionTypeId: number
}

export type ISubscriptionModel = IModelPrototypeNoId<SubscriptionModelType>

export const SubscriptionModel = sequelize.define<ISubscriptionModel>(
  'subscription',
  {
    diaryUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: DiaryUserModel,
            key: 'id'
        }
    },
    subscriptionTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: SubscriptionTypeModel,
            key: 'id'
        }
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false
  }
)
