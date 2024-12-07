import { DataTypes } from 'sequelize'

import { cache, enableCache, sequelize } from '@db'

import { AvatarModel } from '../Avatar'
import { DiaryUserModel } from '../DiaryUser'
import type { IModelPrototypeNoId } from '../types'

// REMOVE IT
// ?
export type UserAvatarModelType = {
  avatarId: bigint
  diaryUserId: bigint
}

export type IUserAvatarModelType = IModelPrototypeNoId<UserAvatarModelType>

const userAvatarModel = sequelize.define<IUserAvatarModelType>('userAvatar', {
  avatarId: {
    type: DataTypes.BIGINT,
    references: {
      model: AvatarModel
    },
    allowNull: false
  },
  diaryUserId: {
    type: DataTypes.BIGINT,
    references: {
      model: DiaryUserModel
    },
    allowNull: false
  }
})

export const UserAvatarModel = enableCache
  ? cache.init<IUserAvatarModelType>(userAvatarModel)
  : userAvatarModel
