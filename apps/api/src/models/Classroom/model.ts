import { cache, enableCache, sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { SPOModel } from '../SPO'
import { IModelPrototype } from '../types'

// REMOVE IT
export type ClassroomModelType = {
  id: number
  building: string
  name: string
  spoId: number
  idFromDiary: number
}

export type IClassroomModelType = IModelPrototype<ClassroomModelType, 'id'>

const classroomModel = sequelize.define<IClassroomModelType>(
  'classroom',
  {
    id: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.INTEGER,
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
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false
  }
)

export const ClassroomModel = enableCache
  ? cache.init<IClassroomModelType>(classroomModel)
  : classroomModel
