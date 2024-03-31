import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { DiaryUserModel } from '../DiaryUser'
import type { IModelPrototypeNoId } from '../types'

export type AuthModelType = {
  diaryUserId: number
  token: string
  lastUsedDate: string
}

export type IAuthModel = IModelPrototypeNoId<AuthModelType>

export const AuthModel = sequelize.define<IAuthModel>('auth', {
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
