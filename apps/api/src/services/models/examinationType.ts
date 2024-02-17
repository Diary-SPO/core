import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { IModelPrototype } from './types'

export type ExaminationTypeModelType = {
  id: number
  name: string
}

export type IExaminationTypeModel = IModelPrototype<
  ExaminationTypeModelType,
  'id'
>

export const ExaminationTypeModel = sequelize.define<IExaminationTypeModel>(
  'examinationType',
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
