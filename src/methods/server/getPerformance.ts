import { PerformanceCurrent } from '@diary-spo/shared'
import { ServerResponse } from '../../types'
import makeRequest from './makeRequest'

export const getPerformance = async (): ServerResponse<PerformanceCurrent> => {
  const id = localStorage.getItem('id')
  return makeRequest<PerformanceCurrent>(`/performance.current/${id}`)
}
