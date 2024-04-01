import type { ServerResponse } from '@types'

import { api } from '../../api.ts'

export const getLogout = async (): ServerResponse<{ success: boolean }> =>
  api.logout.get()
