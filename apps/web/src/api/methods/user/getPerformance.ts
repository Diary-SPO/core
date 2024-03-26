import { PerformanceCurrent } from '@diary-spo/shared'
import { ServerResponse } from '@types'
import makeRequest from '../../makeRequest.ts'

export const getPerformance = async (): ServerResponse<PerformanceCurrent> =>
  makeRequest<PerformanceCurrent>('/performance.current/')
