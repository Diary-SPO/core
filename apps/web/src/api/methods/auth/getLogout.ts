import type { ServerResponse } from '@types'
import makeRequest from '../../makeRequest.ts'

export const getLogout = async (): ServerResponse<{ success: boolean }> => {
  return makeRequest<{ success: boolean }>('/logout/', 'GET')
}
