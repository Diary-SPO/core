import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { DiaryUserModel } from '../DiaryUser'
import { MarkValueModel } from '../MarkValue'
import { SubjectModel } from '../Subject'
import type { IModelPrototypeNoId } from '../types'

export type FinalMarkModelType = {
  subjectId: bigint
  diaryUserId: bigint
  markValueId: number | null
}

export type IFinalMarkModel = IModelPrototypeNoId<FinalMarkModelType>

export const FinalMarkModel = sequelize.define<IFinalMarkModel>('finalMark', {
  subjectId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    references: {
      model: SubjectModel,
      key: 'id'
    }
  },
  diaryUserId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    references: {
      model: DiaryUserModel,
      key: 'id'
    }
  },
  markValueId: {
    type: DataTypes.SMALLINT,
    allowNull: true,
    references: {
      model: MarkValueModel,
      key: 'id'
    }
  }
})
