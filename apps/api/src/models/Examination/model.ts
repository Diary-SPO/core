import { type ExaminationKeys, Examinations } from '@diary-spo/shared'
import { DataTypes } from 'sequelize'

import { cache, enableCache, sequelize } from '@db'

import type { IModelPrototype } from '../types'

export type ExaminationTypeModelType = {
  id: number
  name: ExaminationKeys
}

export type IExaminationTypeModel = IModelPrototype<
  ExaminationTypeModelType,
  'id'
>

const examinationTypeModel = sequelize.define<IExaminationTypeModel>(
  'examinationType',
  {
    id: {
      type: DataTypes.SMALLINT,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.ENUM(...Object.keys(Examinations)),
      allowNull: false,
      unique: true
    }
  }
)

export const ExaminationTypeModel = enableCache
  ? cache.init<IExaminationTypeModel>(examinationTypeModel)
  : examinationTypeModel
