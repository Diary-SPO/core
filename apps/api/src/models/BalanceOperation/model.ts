import { DataTypes } from 'sequelize'

import { cache, enableCache, sequelize } from '@db'

import type {IModelPrototype} from '../types'
import {Nullable} from "@diary-spo/shared";
import {DiaryUserModel} from "../DiaryUser";

export type BalanceOperationModelType = {
  id: bigint
  diaryUserId: bigint
  senderId: Nullable<bigint>
  comment: Nullable<string>
  amount: number
  datetime?: string
}

export type IBalanceOperationModelType = IModelPrototype<BalanceOperationModelType, 'id'>

const balanceOperationModel = sequelize.define<IBalanceOperationModelType>('balanceOperation', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  senderId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: DiaryUserModel
    }
  },
  diaryUserId: {
    type: DataTypes.BIGINT,
    references: {
      model: DiaryUserModel
    }
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: true
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  datetime: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: Date.now()
  }
})

export const BalanceOperationModel = enableCache
  ? cache.init<IBalanceOperationModelType>(balanceOperationModel)
  : balanceOperationModel
