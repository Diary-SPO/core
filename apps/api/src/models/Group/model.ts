import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { SPOModel } from '../SPO'
import { IModelPrototype } from '../types'

export type GroupModelType = {
  id: number
  spoId: number
  groupName: string
  idFromDiary: number
}

export type IGroupModel = IModelPrototype<GroupModelType, 'id'>

export const GroupModel = sequelize.define<IGroupModel>(
  'group',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    spoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: SPOModel,
        key: 'id'
      }
    },
    groupName: {
      type: DataTypes.STRING(31),
      allowNull: false
    },
    idFromDiary: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false
  }
)
