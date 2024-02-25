import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import { Elysia } from 'elysia'
import { helmet } from 'elysia-helmet'

import { routes, adminRoutes } from '@routes'
import { compression } from 'elysia-compression'

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

  .use(
    cors({
      origin: true
    })
  )
  .use(adminRoutes)
  .use(
    compression({
      type: 'gzip',
      options: {
        level: 4
      },
      encoding: 'utf-8'
    })
  )
  .use(helmet())
  .use(routes)
  .listen(port)

console.log(
  `Backend running at http://${app.server?.hostname}:${app.server?.port}`
)

const workerURL = new URL('worker', import.meta.url).href
new Worker(workerURL)
console.log('Worker running!')

// sequelize.sync({logging: true})
