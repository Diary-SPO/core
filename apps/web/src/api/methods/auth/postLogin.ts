import { api } from '../../api.ts'

export const postLogin = async (
  login: string,
  password: string,
  isHash: boolean
) =>
  api.login.post({
    login,
    password,
    isHash
  })
