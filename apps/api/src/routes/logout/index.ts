import { Elysia } from 'elysia'
import logoutHandler from './handler'

const logout = new Elysia().get('/logout', logoutHandler, {
  detail: {
    tags: ['Student']
  }
})

export default logout
