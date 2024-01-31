import { sequelize } from '@db'
import { DataTypes } from 'sequelize'

export const TaskTypeModel = sequelize.define(
  'taskType',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
        type: DataTypes.STRING(25),
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
