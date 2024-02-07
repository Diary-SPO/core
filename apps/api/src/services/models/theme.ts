import { GradebookModel, sequelize } from '@db'
import { DataTypes, Model, Optional } from 'sequelize'

export type ThemeModelType = {
  id: number
  gradebookId: number
  description: string
}

export type IThemeModelType = Model<ThemeModelType, Optional<ThemeModelType, 'id'>> & ThemeModelType

export const ThemeModel = sequelize.define<IThemeModelType>(
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
