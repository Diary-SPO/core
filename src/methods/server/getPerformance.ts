import { PerformanceCurrent } from '@diary-spo/shared'
import { ServerResponse } from '../../types'
import makeRequest from './makeRequest'

export const getPerformance = async (): ServerResponse => {
  const id = localStorage.getItem('id')

  if (!id) {
    return 418
  }

  return makeRequest<PerformanceCurrent>(`/performance.current/${id}`)
}
