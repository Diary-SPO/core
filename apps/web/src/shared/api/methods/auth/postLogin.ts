import { diaryApi } from '@runtime-api'

export const postLogin = async (
  login: string,
  password: string,
  isHash: boolean
) => diaryApi.login(login, password, isHash)
