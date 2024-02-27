import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { IModelPrototype } from './types'
import { DiaryUserModel } from './DiaryUser'
import { SocialTypeModel } from './socialType'

export type NotificationDetailedModelType = {
  id: number
  socialTypeId: number
  diaryUserId: number
  value: string
}

export type INotificationDetailedModel = IModelPrototype<NotificationDetailedModelType, 'id'>

export const NotificationDetailedModel = sequelize.define<INotificationDetailedModel>(
  'notificationDetailed',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    socialTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: SocialTypeModel,
        key: 'id'
      }
    },
    diaryUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: DiaryUserModel,
        key: 'id'
      }
    },
    value: {
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
