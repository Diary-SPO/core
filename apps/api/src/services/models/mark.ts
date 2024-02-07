import { DiaryUserModel, TaskModel, sequelize } from '@db'
import { DataTypes, Model, Optional } from 'sequelize'

export type MarkModelType = {
  id: number
  diaryUserId: number
  taskId: number
  value: 'Five' | 'Four' | 'Three' | 'Two' | ''
}

export type IMarkModelType = Model<MarkModelType, Optional<MarkModelType, 'id'>> & MarkModelType

export const MarkModel = sequelize.define<IMarkModelType>(
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
