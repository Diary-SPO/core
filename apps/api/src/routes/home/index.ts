import { Elysia } from 'elysia'
import { getServerInfo } from './helpers/getServerInfo'

export const HomeController = new Elysia().get('/', () => getServerInfo(), {
  detail: {
    tags: ['Home']
  }
})
