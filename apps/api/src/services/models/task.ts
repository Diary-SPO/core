import { GradebookModel, TaskTypeModel, sequelize } from '@db'
import { DataTypes } from 'sequelize'

export const TaskModel = sequelize.define(
  'task',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    gradebookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: GradebookModel,
            key: 'id'
        }
    },
    taskTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TaskTypeModel,
            key: 'id'
        }
    },
    topic: {
        type: DataTypes.TEXT,
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
