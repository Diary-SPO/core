import { DataTypes } from 'sequelize'

import { sequelize } from '@db'

import { GroupModel } from '../Group'
import { TermTypeModel } from '../TermType'
import type { IModelPrototype } from '../types'

export type AcademicYearModelType = {
  id: bigint
  termTypeId: number
  number: number
  year?: number
  groupId: bigint
  idFromDiary: number
}

export type IAcademicYearModel = IModelPrototype<AcademicYearModelType, 'id'>

export const AcademicYearModel = sequelize.define<IAcademicYearModel>(
  'academicYear',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    termTypeId: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: TermTypeModel,
        key: 'id'
      }
    },
    number: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    year: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    groupId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: GroupModel,
        key: 'id'
      }
    },
    idFromDiary: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }
)
