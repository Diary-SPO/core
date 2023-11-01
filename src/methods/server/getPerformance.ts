import { PerformanceCurrent } from 'diary-shared'
import makeRequest from './makeRequest'

export const getPerformance = async (): Promise<
  PerformanceCurrent | 418 | 429
> => {
  const id = localStorage.getItem('id')

  if (!id) {
    return 418
  }

  return makeRequest<PerformanceCurrent>(`/performance.current/${id}`)
}
