import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { AcademicYearModel } from '../AcademicYear'
import { IModelPrototype } from '../types'

export type TermModelType = {
  id: number
  idFromDiary: number
  number: number
  isActive: boolean
  academicYearId: number
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
    type: DataTypes.INTEGER,
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
