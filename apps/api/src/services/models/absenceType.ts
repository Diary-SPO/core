import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { IModelPrototype } from './types'

export type AbsenceTypeModelType = {
  id: number
  name: string
}

export type IAbsenceTypeModel = IModelPrototype<AbsenceTypeModelType, 'id'>

export const AbsenceTypeModel = sequelize.define<IAbsenceTypeModel>(
  'absenceType',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
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
