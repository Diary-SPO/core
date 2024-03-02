import { cache, enableCache, sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { IModelPrototype } from '../types'

export type SubjectModelType = {
  id: number
  name: string
}

export type ISubjectModelType = IModelPrototype<SubjectModelType, 'id'>

const subjectModel = sequelize.define<ISubjectModelType>(
  'subject',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }
)

export const SubjectModel = enableCache
  ? cache.init<ISubjectModelType>(subjectModel)
  : subjectModel
