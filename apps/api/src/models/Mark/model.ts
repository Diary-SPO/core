import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { DiaryUserModel } from '../DiaryUser'
import { MarkValueModel } from '../MarkValue'
import { TaskModel } from '../Task'
import { TermModel } from '../Term'
import type { IModelPrototypeNoId } from '../types'

export type MarkModelType = {
  diaryUserId: bigint
  taskId: bigint
  markValueId: number
  termId: bigint | null
}

export type IMarkModelType = IModelPrototypeNoId<MarkModelType>

export const MarkModel = sequelize.define<IMarkModelType>('mark', {
  diaryUserId: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
    references: {
      model: DiaryUserModel
    }
  },
  taskId: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
    references: {
      model: TaskModel
    }
  },
  markValueId: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    references: {
      model: MarkValueModel
    }
  },
  termId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: TermModel
    }
  }
})
