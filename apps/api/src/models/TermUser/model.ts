import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { DiaryUserModel } from '../DiaryUser'
import { TermModel } from '../Term'
import type { IModelPrototypeNoId } from '../types'

export type TermUserModelType = {
  termId: bigint
  diaryUserId: bigint
}

export type ITermUserModel = IModelPrototypeNoId<TermUserModelType>

export const TermUserModel = sequelize.define<ITermUserModel>('termUser', {
  termId: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
    references: {
      model: TermModel
    }
  },
  diaryUserId: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
    references: {
      model: DiaryUserModel
    }
  }
})
