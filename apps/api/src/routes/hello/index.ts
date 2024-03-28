import { Elysia } from 'elysia'
import { getServerInfo } from './helpers'

const hello = new Elysia().get('/', async () => await getServerInfo(), {
  detail: {
    tags: ['Home']
  }
})

export default hello
