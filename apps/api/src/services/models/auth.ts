import { sequelize } from '../index'
import { DataTypes } from 'sequelize'
import { DiaryUserModel } from './diaryUser'

export const AuthModel = sequelize.define(
  'auth',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    idDiaryUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: DiaryUserModel,
        key: 'id'
      }
    },
    token: {
      type: DataTypes.STRING(24),
      allowNull: false,
      unique: true
    },
    lastUsedDate: {
      type: DataTypes.STRING(10),
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
