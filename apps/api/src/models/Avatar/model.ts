import { DataTypes } from 'sequelize'

import { cache, enableCache, sequelize } from '@db'

import { SPOModel } from '../SPO'
import type { IModelPrototype } from '../types'

// REMOVE IT
// ?
export type AvatarModelType = {
  id: number
  filename: string
  price: number
  isAnimated: boolean
}

export type IAvatarModelType = IModelPrototype<AvatarModelType, 'id'>

const avatarModel = sequelize.define<IAvatarModelType>('avatar', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  filename: {
    type: DataTypes.STRING(35),
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1000
  },
  isAnimated: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
})

export const AvatarModel = enableCache
  ? cache.init<IAvatarModelType>(avatarModel)
  : avatarModel
