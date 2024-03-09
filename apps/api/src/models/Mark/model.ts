import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { DiaryUserModel } from '../DiaryUser'
import { MarkValueModel } from '../MarkValue'
import { TaskModel } from '../Task'
import { IModelPrototypeNoId } from '../types'
import { TermModel } from '../Term'

export type MarkModelType = {
  diaryUserId: number
  taskId: number
  markValueId: number
  termId: number
}

export type IMarkModelType = IModelPrototypeNoId<MarkModelType>

export const MarkModel = sequelize.define<IMarkModelType>('mark', {
  diaryUserId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: DiaryUserModel
    }
  },
  taskId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: TaskModel
    }
  },
  markValueId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: MarkValueModel
    }
  },
  termId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: TermModel
    }
  }
})
