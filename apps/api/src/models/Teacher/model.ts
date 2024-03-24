import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { SPOModel } from '../SPO'
import { IModelPrototype } from '../types'

export type TeacherModelType = {
  id: number
  spoId: number
  firstName: string
  lastName: string
  middleName?: string
  idFromDiary?: number
}

export type ITeacherModel = IModelPrototype<TeacherModelType, 'id'>

export const TeacherModel = sequelize.define<ITeacherModel>('teacher', {
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
    allowNull: true
  },
  idFromDiary: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['spoId', 'idFromDiary']
    },
    {
      unique: true,
      fields: ['spoId', 'firstName', 'lastName', 'middleName']
    },
  ]
})