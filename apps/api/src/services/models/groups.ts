import { sequelize } from '@db'
import { DataTypes, Model, Optional } from 'sequelize'
import { SPOModel } from './SPO'

export type GroupsModelType = {
  id: number
  spoId: number
  groupName: string
  diaryGroupId: number
}

export type IGroupsModel = Model<
  GroupsModelType,
  Optional<GroupsModelType, 'id'>
> &
  GroupsModelType

export const GroupsModel = sequelize.define<IGroupsModel>(
  'groups',
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
    diaryGroupId: {
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
