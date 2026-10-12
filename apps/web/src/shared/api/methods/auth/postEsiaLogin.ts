import { diaryApi } from '@runtime-api'

export const postEsiaLogin = async (diaryUrl?: string) =>
  diaryApi.loginWithEsia(diaryUrl)
