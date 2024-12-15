import { DataTypes } from 'sequelize'

import { sequelize } from '@db'

import { DiaryUserModel } from '../DiaryUser'
import type { IModelPrototype, IModelPrototypeNoId } from '../types'

export type AuthModelType = {
  id: bigint
  diaryUserId: bigint
  token: string
  lastUsedDate: string
}

export type IAuthModel = IModelPrototype<AuthModelType, 'id'>

export const AuthModel = sequelize.define<IAuthModel>('auth', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  diaryUserId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: DiaryUserModel,
      key: 'id'
    }
  },
  token: {
    type: DataTypes.STRING(24),
    allowNull: false,
    unique: true
  },
  lastUsedDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
})
