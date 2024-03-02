import { cache, enableCache, sequelize } from '@db'
import { AbsenceTypes, AbsenceTypesKeys } from '@diary-spo/shared'
import { DataTypes } from 'sequelize'
import { IModelPrototype } from '../types'
import { AbsenceTypeModel } from '../AbsenceType'
import { ScheduleModel } from '../Schedule'
import { DiaryUserModel } from '../DiaryUser'

export type AbsenceModelType = {
  id: number
  absenceTypeId: number
  scheduleId: number
  diaryUserId: number
}

export type IAbsenceModel = IModelPrototype<AbsenceModelType, 'id'>

const absenceModel = sequelize.define<IAbsenceModel>(
  'absenceType',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    absenceTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AbsenceTypeModel
      }
    },
    scheduleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ScheduleModel
      }
    },
    diaryUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: DiaryUserModel
      }
    }
  }
)

export const AbsenceModel = enableCache
  ? cache.init<IAbsenceModel>(absenceModel)
  : absenceModel
