import { DiaryUserModel, TaskModel, sequelize } from '@db'
import { DataTypes } from 'sequelize'

export const RequiredsModel = sequelize.define(
  'requireds',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    diaryUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: DiaryUserModel,
            key: 'id'
        }
    },
    taskId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TaskModel,
            key: 'id'
        }
    },
    isRequired: {
        type: DataTypes.BOOLEAN,
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
