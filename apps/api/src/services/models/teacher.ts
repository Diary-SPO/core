import { sequelize } from '@db'
import { DataTypes, Model, Optional } from 'sequelize'
import { SPOModel } from './SPO'

export type TeacherModelType = {
  id: number
  spoId: number
  firstName: string
  lastName: string
  middleName: string
}

export type ITeacherModel = Model<
  TeacherModelType,
  Optional<TeacherModelType, 'id'>
> &
  TeacherModelType

export const TeacherModel = sequelize.define<ITeacherModel>(
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
