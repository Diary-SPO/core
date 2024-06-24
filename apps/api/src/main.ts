import { TIMEZONE } from '@config'
import { sequelize } from '@db'
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import { Elysia } from 'elysia'
import { compression } from 'elysia-compression'
import { helmet } from 'elysia-helmet'
import { getTimezone } from './config/getTimeZone'
import { routes } from './routes'
import getOrganization from './routes/organization/handler'
import { AuthService } from './services/AuthService'

// настраиваем сервер...
const port = Bun.env.PORT ?? 3003

const app = new Elysia()
  .use(
    swagger({
      path: '/documentation',
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
  .use(helmet())
  // .use(AuthService)
  // .guard({
  //   isSignIn: true
  // })
  // .get(
  //   '/organization',
  //   ({
  //     Auth: {
  //       user: { localUserId, cookie }
  //     }
  //   }) => getOrganization({ userId: localUserId, cookie }),
  //   {
  //     detail: {
  //       tags: ['Organization']
  //     }
  //   }
  // )
  .use(routes)
  .listen(port)

console.log(
  `Backend running at http://${app.server?.hostname}:${app.server?.port}`
)

// Соробщение о текущем часовом поясе
console.log(
  `Будет использоваться следующая часовая зона: '${TIMEZONE}'${
    getTimezone() !== TIMEZONE ? ' (задана через .env)' : ''
  }.`
)

export type App = typeof app
sequelize.sync()
const workerURL = new URL('worker', import.meta.url).href
new Worker(workerURL)
console.log('===============', 'Worker running!', '===============')
