import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import { Elysia } from 'elysia'
import { compression } from 'elysia-compression'
import { helmet } from 'elysia-helmet'

import { TIMEZONE } from '@config'
import { sequelize } from '@db'

import { getTimezone } from './config/getTimeZone'
import { routes } from './routes'

import './models/relations'
import { syncDatabaseForDecorations } from './helpers/syncDatabaseForDecorations'
import {crutchesInit} from "./helpers/crutches";

// Подключаем костыли
crutchesInit()

// настраиваем сервер...
const port = Bun.env.PORT ?? 3003

const app = new Elysia()
  .use(
    swagger({
      path: '/documentation',
      autoDarkMode: true,
      scalarConfig: {
        theme: 'purple'
      },
      documentation: {
        info: {
          title: 'Документация к api.spo-diary.ru',
          version: '1.0.0'
        }
      }
    })
  )
  // вырубаем корс...
  .use(
    cors({
      origin: true
    })
  )
  // сжатие...
  .use(
    compression({
      type: 'gzip',
      options: {
        level: 4
      },
      encoding: 'utf-8'
    })
  )
  // заголовки...
  .use(
    helmet({
      contentSecurityPolicy: false
    })
  )
  .use(routes)
  .listen(port)

await sequelize.sync()

console.log(
  `Backend running at http://${app.server?.hostname}:${app.server?.port}`
)

// Соробщение о текущем часовом поясе
console.log(
  `Будет использоваться следующая часовая зона: '${TIMEZONE}'${
    getTimezone() !== TIMEZONE ? ' (задана через .env)' : ''
  }.`
)

await syncDatabaseForDecorations()

export type App = typeof app
const workerURL = new URL('worker', import.meta.url).href
new Worker(workerURL)
console.log('===============', 'Worker running!', '===============')
