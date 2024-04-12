import { Grade, type MarkKeys } from '@diary-spo/shared'
import { DataTypes } from 'sequelize'

import { cache, enableCache, sequelize } from '@db'

import type { IModelPrototype } from '../types'

export type MarkValueModelType = {
  id: number
  value: MarkKeys
}

export type IMarkValueModelType = IModelPrototype<MarkValueModelType, 'id'>

const markValueModel = sequelize.define<IMarkValueModelType>('markValue', {
  id: {
    type: DataTypes.SMALLINT,
    primaryKey: true,
    autoIncrement: true
  },
  value: {
    type: DataTypes.ENUM(...Object.keys(Grade)),
    allowNull: false,
    set(value: MarkKeys) {
      if (!Object.keys(Grade).includes(value)) {
        console.warn(
          `Предупреждение: значение ${value} не присутствует в перечислении Grade`
        )
      }

      this.setDataValue('value', value)
    },
    unique: true
  }
})

export const MarkValueModel = enableCache
  ? cache.init<IMarkValueModelType>(markValueModel)
  : markValueModel
