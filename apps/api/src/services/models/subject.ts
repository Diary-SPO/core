import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { IModelPrototype } from './types'

export type SubjectModelType = {
  id: number
  name: string
}

export type ISubjectModelType = IModelPrototype<SubjectModelType, 'id'>

export const SubjectModel = sequelize.define<ISubjectModelType>(
  'subject',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(35),
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
