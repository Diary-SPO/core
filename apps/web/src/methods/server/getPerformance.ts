import { PerformanceCurrent } from '@diary-spo/shared'
import { ServerResponse } from '@types'
import makeRequest from '../makeRequest'

export const getPerformance = async (): ServerResponse<PerformanceCurrent> => {
  return makeRequest<PerformanceCurrent>(`/performance.current/`)
}
