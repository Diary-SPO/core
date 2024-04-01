import { DataTypes } from 'sequelize'

import { sequelize } from '@db'

import { GroupModel } from '../Group'
import type { IModelPrototype } from '../types'

export type SubgroupModelType = {
  id: bigint
  name: string
  groupId: bigint
}

export type ISubgroupModelType = IModelPrototype<SubgroupModelType, 'id'>

export const SubgroupModel = sequelize.define<ISubgroupModelType>('subgroup', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(35),
    allowNull: false,
    unique: 'subgroup_unique'
  },
  groupId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: GroupModel,
      key: 'id'
    },
    unique: 'subgroup_unique'
  }
})
