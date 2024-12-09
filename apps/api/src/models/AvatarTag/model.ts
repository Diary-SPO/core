import { DataTypes } from 'sequelize'

import { cache, enableCache, sequelize } from '@db'

import { AvatarModel } from '../Avatar'
import { TagModel } from '../Tag'
import type { IModelPrototypeNoId } from '../types'

// REMOVE IT
// ?
export type AvatarTagModelType = {
  avatarId: bigint
  tagId: bigint
}

export type IAvatarTagModelType = IModelPrototypeNoId<AvatarTagModelType>

const avatarTagModel = sequelize.define<IAvatarTagModelType>('avatarTag', {
  avatarId: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
    references: {
      model: AvatarModel
    }
  },
  tagId: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
    references: {
      model: TagModel
    }
  }
})

export const AvatarTagModel = enableCache
  ? cache.init<IAvatarTagModelType>(avatarTagModel)
  : avatarTagModel
