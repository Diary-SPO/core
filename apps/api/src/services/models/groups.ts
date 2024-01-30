import { sequelize } from '../index'
import { DataTypes } from 'sequelize'
import { SPOModel } from './SPO'

export const GroupsModel = sequelize.define(
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
