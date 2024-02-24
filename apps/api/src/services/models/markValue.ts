import { cache, enableCache, sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { IModelPrototype } from './types'
import { Grade, MarkKeys } from '@diary-spo/shared'

export type MarkValueModelType = {
  id: number
  value: MarkKeys
}

export type IMarkValueModelType = IModelPrototype<MarkValueModelType, 'id'>

const markValueModel = sequelize.define<IMarkValueModelType>(
  'markValue',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    value: {
      type: DataTypes.ENUM(...Object.keys(Grade)),
      allowNull: false,
      set(value: string) {
        if (!Object.keys(Grade).includes(value)) {
          console.warn(
            `Предупреждение: значение ${value} не присутствует в перечислении Grade`
          )
        }

        this.setDataValue('value', value as MarkKeys)
      }
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false
  }
)

export const MarkValueModel =  enableCache ? cache.init<IMarkValueModelType>(markValueModel) : markValueModel