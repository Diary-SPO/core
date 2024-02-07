import { DiaryUserModel, TaskModel, sequelize } from '@db'
import { DataTypes, Model, Optional } from 'sequelize'

export type RequiredsModelType = {
  id: number
  diaryUserId: number
  taskId: number
  isRequired: boolean
}

export type IRequiredsModel = Model<RequiredsModelType, Optional<RequiredsModelType, 'id'>> & RequiredsModelType

export const RequiredsModel = sequelize.define<IRequiredsModel>(
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
