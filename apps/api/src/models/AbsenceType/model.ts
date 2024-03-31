import { cache, enableCache, sequelize } from '@db'
import { AbsenceTypes, AbsenceTypesKeys } from '@diary-spo/shared'
import { DataTypes } from 'sequelize'
import { IModelPrototype } from '../types'

export type AbsenceTypeModelType = {
  id: number
  name: AbsenceTypesKeys
}

export type IAbsenceTypeModel = IModelPrototype<AbsenceTypeModelType, 'id'>

const absenceTypeModel = sequelize.define<IAbsenceTypeModel>('absenceType', {
  id: {
    type: DataTypes.SMALLINT,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.ENUM(...Object.keys(AbsenceTypes)),
    allowNull: false,
    unique: true
  }
})

export const AbsenceTypeModel = enableCache
  ? cache.init<IAbsenceTypeModel>(absenceTypeModel)
  : absenceTypeModel
