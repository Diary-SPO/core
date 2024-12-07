import { DataTypes } from 'sequelize'

import { cache, enableCache, sequelize } from '@db'

import type { IModelPrototype } from '../types'

// REMOVE IT
// ?
export type TagModelType = {
  id: bigint
  value: string
}

export type ITagModelType = IModelPrototype<TagModelType, 'id'>

const tagModel = sequelize.define<ITagModelType>('tag', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

export const TagModel = enableCache
  ? cache.init<ITagModelType>(tagModel)
  : tagModel
