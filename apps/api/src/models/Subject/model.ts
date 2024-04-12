import { DataTypes } from 'sequelize'

import { cache, enableCache, sequelize } from '@db'

import type { IModelPrototype } from '../types'

export type SubjectModelType = {
  id: bigint
  name: string
}

export type ISubjectModelType = IModelPrototype<SubjectModelType, 'id'>

const subjectModel = sequelize.define<ISubjectModelType>('subject', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
})

export const SubjectModel = enableCache
  ? cache.init<ISubjectModelType>(subjectModel)
  : subjectModel
