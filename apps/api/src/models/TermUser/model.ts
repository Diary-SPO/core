import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { DiaryUserModel } from '../DiaryUser'
import { TermModel } from '../Term'
import { IModelPrototypeNoId } from '../types'

export type TermUserModelType = {
  termId: number
  diaryUserId: number
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
