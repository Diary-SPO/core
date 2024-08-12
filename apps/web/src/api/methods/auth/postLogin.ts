import { client } from '../../client.ts'

export const postLogin = async (
  login: string,
  password: string,
  isHash: boolean
) =>
  client.auth.login.post({
    login: login,
    password: password,
    isHash: isHash
  })
