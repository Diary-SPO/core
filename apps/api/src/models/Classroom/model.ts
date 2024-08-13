import { DataTypes } from 'sequelize'

import { cache, enableCache, sequelize } from '@db'

import { SPOModel } from '../SPO'
import type { IModelPrototype } from '../types'

// REMOVE IT
// ?
export type ClassroomModelType = {
  id: bigint
  building: string
  name: string
  spoId: bigint
  idFromDiary: number
}

export type IClassroomModelType = IModelPrototype<ClassroomModelType, 'id'>

const classroomModel = sequelize.define<IClassroomModelType>('classroom', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  building: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(35),
    allowNull: false
  },
  spoId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: SPOModel,
      key: 'id'
    },
    unique: 'classroom_uniq_k'
  },
  idFromDiary: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: 'classroom_uniq_k'
  }
})

export const ClassroomModel = enableCache
  ? cache.init<IClassroomModelType>(classroomModel)
  : classroomModel
