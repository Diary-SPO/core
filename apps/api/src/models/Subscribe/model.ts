import { DataTypes } from 'sequelize'

import { cache, enableCache, sequelize } from '@db'

import { DiaryUserModel } from '../DiaryUser'
import type { IModelPrototypeNoId } from '../types'

export type SubscribeModelType = {
  diaryUserId: bigint
  tgId: bigint
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
  }
})

export const SubscribeModel = enableCache
  ? cache.init<ISubscribeModelType>(subscribeModel)
  : subscribeModel
