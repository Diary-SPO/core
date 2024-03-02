import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { GroupModel } from '../Group'
import { IModelPrototype } from '../types'

export type SubgroupModelType = {
  id: number
  name: string
  groupId: number
}

export type ISubgroupModelType = IModelPrototype<SubgroupModelType, 'id'>

export const SubgroupModel = sequelize.define<ISubgroupModelType>('subgroup', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(35),
    allowNull: false,
    unique: 'subgroup_unique'
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: GroupModel,
      key: 'id'
    },
    unique: 'subgroup_unique'
  }
})
