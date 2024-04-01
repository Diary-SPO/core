import { Elysia, t } from 'elysia'
import postAuth from './handler'

// const schema = {
//   body: t.Object({
//     login: t.String(),
//     password: t.String(),
//     isHash: t.Boolean()
//   })
// }

const login = new Elysia().post('/login', postAuth, {
  body: t.Object({
    login: t.String(),
    password: t.String(),
    isHash: t.Boolean()
  })
  // detail: {
  //   tags: ['Auth']
  // }
})

export default login
