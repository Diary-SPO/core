import { SPOModel, sequelize } from '@db'
import { DataTypes } from 'sequelize'

export const TeacherModel = sequelize.define(
  'teacher',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    spoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: SPOModel,
        key: 'id'
      }
    },
    firstName: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    middleName: {
      type: DataTypes.STRING(45),
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
