import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { IModelPrototype } from '../types'
import { SocialTypeModel } from '../SocialType'

export type SocialStepTypeModelType = {
  id: number
  socialTypeId: number
  step: number
  title: string
  description: string
  value?: string | null
  toCopy: boolean
  toLink: boolean
}

export type ISocialStepTypeModel = IModelPrototype<
  SocialStepTypeModelType,
  'id'
>

export const SocialStepTypeModel = sequelize.define<ISocialStepTypeModel>(
  'socialStepType',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    socialTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: SocialTypeModel,
        key: 'id'
      }
    },
    step: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
      type: DataTypes.STRING,
      allowNull: true
    },
    toCopy: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    toLink: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false
  }
)
