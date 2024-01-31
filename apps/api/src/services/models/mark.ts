import { DiaryUserModel, TaskModel, sequelize } from '@db'
import { DataTypes } from 'sequelize'

export const MarkModel = sequelize.define(
  'mark',
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
    value: {
        type: DataTypes.ENUM('Five', 'Four', 'Three', 'Two', ''),
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
