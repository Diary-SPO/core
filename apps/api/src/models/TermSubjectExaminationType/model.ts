import { sequelize } from '@db'
import {
  TermSubjectExaminationKeys,
  TermSubjectExaminations
} from '@diary-spo/shared'
import { DataTypes } from 'sequelize'
import { IModelPrototype } from '../types'

export type TermSubjectExaminationTypeModelType = {
  id: number
  name: TermSubjectExaminationKeys
}

export type ITermSubjectExaminationTypeModel = IModelPrototype<
  TermSubjectExaminationTypeModelType,
  'id'
>

export const TermSubjectExaminationTypeModel =
  sequelize.define<ITermSubjectExaminationTypeModel>(
    'termSubjectExaminationType',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.ENUM(...Object.keys(TermSubjectExaminations)),
        allowNull: false
      }
    }
  )
