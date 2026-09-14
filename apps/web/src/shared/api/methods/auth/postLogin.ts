import { diaryApi } from '@runtime-api'

export const postLogin = async (
  login: string,
  password: string,
  isHash: boolean,
  diaryUrl?: string
) => diaryApi.login(login, password, isHash, diaryUrl)
