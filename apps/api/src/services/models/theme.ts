import { GradebookModel, sequelize } from '@db'
import { DataTypes } from 'sequelize'

export const ThemeModel = sequelize.define(
  'theme',
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
    description: {
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
