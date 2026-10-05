import { diaryApi } from '@runtime-api'
import type { EsiaLoginMode } from '../../runtime/types.ts'

export const postEsiaLogin = async (mode: EsiaLoginMode, diaryUrl?: string) =>
  diaryApi.loginWithEsia(mode, diaryUrl)
