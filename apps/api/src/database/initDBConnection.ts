import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USERNAME,
  TIMEZONE
} from '@config'
import { error } from '@utils'
import { exit } from 'process'
import { Sequelize } from 'sequelize'
import SequelizeSimpleCache from 'sequelize-simple-cache'

export const sequelize = new Sequelize({
  database: DATABASE_NAME,
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  dialect: 'postgres',
  //logging: errorLogger,
  logQueryParameters: true,
  timezone: TIMEZONE,
  pool: {
    max: 30,
    min: 1,
    acquire: 30000, // К-ство миллисекунд, прежде чем выбросить ошибку
    idle: 10000 // К-ство миллисекунд, прежде чем освободить "неактивное" соединение (время ожидания)
  }
})

// Кешируем всё то, что почти не обновляется
export const cache = new SequelizeSimpleCache({
  absenceType: { ttl: 0 },
  classroom: { ttl: 0 },
  taskType: { ttl: 0 },
  termType: { ttl: 0 },
  lessonType: { ttl: 0 },
  subject: { ttl: 0 },
  markValue: { ttl: 0 }
})
// Включить кеширование ?
export const enableCache = false
// Синхронизовать таблицы ?
export const forceSyncDatabase = false

try {
  await sequelize.authenticate()
  console.log('Database: Connection succefully!')
} catch (err) {
  error('Ошибка подключения к Базе Данных: ', err)
  exit()
}
