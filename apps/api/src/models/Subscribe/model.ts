import { DataTypes } from 'sequelize'

import { cache, enableCache, sequelize } from '@db'

import { DiaryUserModel } from '../DiaryUser'
import type { IModelPrototypeNoId } from '../types'

export type SubscribeModelType = {
  diaryUserId: bigint
  tgId: bigint
  preActionsIsSuccess: boolean
}

export type ISubscribeModelType = IModelPrototypeNoId<SubscribeModelType>

const subscribeModel = sequelize.define<ISubscribeModelType>('subscribe', {
  diaryUserId: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    references: {
      model: DiaryUserModel,
      key: 'id'
    }
  },
  tgId: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  preActionsIsSuccess: {
    type: DataTypes.BOOLEAN,
    primaryKey: false,
    allowNull: false,
    unique: false
  }
})

export const SubscribeModel = enableCache
  ? cache.init<ISubscribeModelType>(subscribeModel)
  : subscribeModel
