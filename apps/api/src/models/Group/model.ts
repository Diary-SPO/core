import { DataTypes } from 'sequelize'

import { sequelize } from '@db'

import { SPOModel } from '../SPO'
import type { IModelPrototype } from '../types'

export type GroupModelType = {
  id: bigint
  spoId: bigint
  groupName: string
  idFromDiary: number
}

export type IGroupModel = IModelPrototype<GroupModelType, 'id'>

export const GroupModel = sequelize.define<IGroupModel>('group', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  spoId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: SPOModel,
      key: 'id'
    },
    unique: 'group_uniq_k'
  },
  groupName: {
    type: DataTypes.STRING(31),
    allowNull: false
  },
  idFromDiary: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: 'group_uniq_k'
  }
})
