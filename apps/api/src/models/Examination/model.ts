import { sequelize } from '@db'
import { ExaminationKeys, Examinations } from '@diary-spo/shared'
import { DataTypes } from 'sequelize'
import { IModelPrototype } from '../types'

export type ExaminationTypeModelType = {
  id: number
  name: ExaminationKeys
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
      type: DataTypes.ENUM(...Object.keys(Examinations)),
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
