import { DataTypes } from 'sequelize'

import { cache, enableCache, sequelize } from '@db'

import { AbsenceTypeModel } from '../AbsenceType'
import { DiaryUserModel } from '../DiaryUser'
import { ScheduleModel } from '../Schedule'

import type { IModelPrototype } from '../types'

export type AbsenceModelType = {
  id: bigint
  absenceTypeId: number
  scheduleId: bigint
  diaryUserId: bigint
}

export type IAbsenceModel = IModelPrototype<AbsenceModelType, 'id'>

const absenceModel = sequelize.define<IAbsenceModel>('absence', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  absenceTypeId: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    primaryKey: true,
    references: {
      model: AbsenceTypeModel
    }
  },
  scheduleId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    references: {
      model: ScheduleModel
    }
  },
  diaryUserId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    references: {
      model: DiaryUserModel
    }
  }
})

export const AbsenceModel = enableCache
  ? cache.init<IAbsenceModel>(absenceModel)
  : absenceModel
