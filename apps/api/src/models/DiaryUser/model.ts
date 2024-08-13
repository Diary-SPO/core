import type { Nullable } from '@diary-spo/shared'
import { DataTypes } from 'sequelize'

import { KEY } from '@config'
import { sequelize } from '@db'
import { formatDate } from '@utils'

import { GroupModel } from '../Group'
import type { IModelPrototype } from '../types'

// REMOVE IT
// ?
export type DiaryUserModelType = {
  id: bigint
  groupId: bigint
  login: string
  password: string
  phone?: string
  birthday: string
  firstName: string
  lastName: string
  middleName?: string
  cookie: string
  cookieLastDateUpdate?: string
  termLastDateUpdate?: Nullable<string>
  termStartDate?: Nullable<string>
  isAdmin: boolean
  idFromDiary: number
}

export type IDiaryUserModel = IModelPrototype<DiaryUserModelType, 'id'>

export const DiaryUserModel = sequelize.define<IDiaryUserModel>('diaryUser', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  groupId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'id группы пользователя. Берётся из базы',
    references: {
      model: GroupModel,
      key: 'id'
    }
  },
  login: {
    type: DataTypes.STRING(45),
    allowNull: false,
    comment: 'Логин пользователя в Сетевом городе'
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment:
      'Зашифрованный хеш пароля от аккаунта пользователя в Сетевом городе',
    set(value: string) {
      this.setDataValue('password', KEY.encrypt(value))
    },
    get() {
      return KEY.decrypt(this.getDataValue('password'))
    }
  },
  phone: {
    type: DataTypes.STRING(45),
    allowNull: true,
    defaultValue: null,
    comment: 'Номер телефона пользователя из Сетевого города'
  },
  birthday: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: 'Дата рождения пользователя из Сетевого города'
  },
  firstName: {
    type: DataTypes.STRING(40),
    allowNull: false,
    comment: 'Фамилия пользователя из Сетевого города'
  },
  lastName: {
    type: DataTypes.STRING(40),
    allowNull: false,
    comment: 'Имя пользователя из Сетевого города'
  },
  middleName: {
    type: DataTypes.STRING(40),
    allowNull: true,
    defaultValue: null,
    comment: 'Отчество пользователя из Сетевого города'
  },
  cookie: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Cookie от авторизации пользователя в Сетевом городе',
    set(value: string) {
      this.setDataValue('cookie', KEY.encrypt(value))
    },
    get() {
      return KEY.decrypt(this.getDataValue('cookie'))
    }
  },
  cookieLastDateUpdate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: formatDate(new Date().toISOString()), // Текущая дата по умолчанию
    comment:
      'Последняя дата обновления куки пользователя. Нужно обновлять, в теории, не реже, чем каждые 14 дней'
  },
  termLastDateUpdate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    defaultValue: null,
    comment: 'Последняя дата обновления активного семестра'
  },
  termStartDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    defaultValue: null,
    comment: 'Дата начала семестра (нужно для правильного сохранения оценок)'
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Признак администратора'
  },
  idFromDiary: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'id пользователя из дневника'
  }
})
