import { GradebookModel, TaskTypeModel, sequelize } from '@db'
import { DataTypes, Model, Optional } from 'sequelize'

export type TaskModelType = {
  id: number
  gradebookId: number
  taskTypeId: number
  topic: string
}

export type ITaskModel = Model<TaskModelType, Optional<TaskModelType, 'id'>> &
  TaskModelType

export const TaskModel = sequelize.define<ITaskModel>(
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
