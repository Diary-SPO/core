import { ENCRYPT_KEY } from '@config'
import { sequelize } from '@db'
import { decrypt, encrypt } from '@diary-spo/sql'
import { formatDate } from '@utils'
import { DataTypes } from 'sequelize'
import { GroupsModel } from './groups'

// FIXME: че ему надо первым параметром отдать?
export const DiaryUserModel = sequelize.define(
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
        model: GroupsModel,
        key: 'id'
      }
    },
    login: {
      type: DataTypes.STRING(30),
      allowNull: false,
      comment: 'Логин пользователя в Сетевом городе'
    },
    password: {
      type: DataTypes.STRING(90),
      allowNull: false,
      comment:
        'Зашифрованный хеш пароля от аккаунта пользователя в Сетевом городе',
      set(value) {
        this.setDataValue('password', encrypt(value as string, ENCRYPT_KEY))
      },
      get() {
        return decrypt(this.getDataValue('password'), ENCRYPT_KEY)
      }
    },
    phone: {
      type: DataTypes.STRING(25),
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
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: formatDate(new Date().toISOString()), // Текущая дата по умолчанию
      comment:
        'Последняя дата обновления куки пользователя. Нужно обновлять, в теории, не реже, чем каждые 14 денй'
    }
  },
  {
    freezeTableName: true, // Говорим, что имя модели = Имя таблицы
    timestamps: false,
    createdAt: false,
    updatedAt: false
  }
)
