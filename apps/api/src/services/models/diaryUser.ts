import { ENCRYPT_KEY } from '@config'
import { sequelize } from '@db'
import { decrypt, encrypt } from '@diary-spo/sql'
import { formatDate } from '@utils'
import { DataTypes } from 'sequelize'
import { GroupModel } from './group'
import { IModelPrototype } from './types'

export type DiaryUserModelType = {
  id: number
  groupId: number
  login: string
  password: string
  phone?: string
  birthday: string
  firstName: string
  lastName: string
  middleName?: string
  cookie: string
  cookieLastDateUpdate: string
  isAdmin: boolean
  idFromDiary: number
}

export type IDiaryUserModel = IModelPrototype<DiaryUserModelType, 'id'>

export const DiaryUserModel = sequelize.define<IDiaryUserModel>(
  'diaryUser',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    groupId: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.STRING,
      allowNull: false,
      comment:
        'Зашифрованный хеш пароля от аккаунта пользователя в Сетевом городе',
      set(value: string) {
        this.setDataValue('password', encrypt(value, ENCRYPT_KEY))
      },
      get() {
        return decrypt(this.getDataValue('password'), ENCRYPT_KEY)
      }
    },
    phone: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue: null,
      comment: 'Номер телефона пользователя из Сетевого города'
    },
    birthday: {
      type: DataTypes.DATE,
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
      set(value) {
        this.setDataValue('cookie', encrypt(value as string, ENCRYPT_KEY))
      },
      get() {
        return decrypt(this.getDataValue('cookie'), ENCRYPT_KEY)
      }
    },
    cookieLastDateUpdate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: formatDate(new Date().toISOString()), // Текущая дата по умолчанию
      comment:
        'Последняя дата обновления куки пользователя. Нужно обновлять, в теории, не реже, чем каждые 14 дней'
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
  },
  {
    freezeTableName: true, // Говорим, что имя модели = Имя таблицы
    timestamps: false,
    createdAt: false,
    updatedAt: false
  }
)
