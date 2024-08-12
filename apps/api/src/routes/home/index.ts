import { Elysia } from 'elysia'
import { getServerInfo } from '../hello/helpers'

export const HomeController = new Elysia().get('/', () => getServerInfo(), {
  detail: {
    tags: ['Home']
  }
})
