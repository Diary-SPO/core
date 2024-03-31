import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { AcademicYearModel } from '../AcademicYear'
import type { IModelPrototype } from '../types'

export type TermModelType = {
  id: bigint
  idFromDiary: number
  number: number
  isActive: boolean
  academicYearId: bigint
}

export type ITermModel = IModelPrototype<TermModelType, 'id'>

export const TermModel = sequelize.define<ITermModel>('term', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  idFromDiary: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  number: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  academicYearId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: AcademicYearModel,
      key: 'id'
    }
  }
})
