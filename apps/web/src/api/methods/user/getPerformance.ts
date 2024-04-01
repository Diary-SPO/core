import type { PerformanceCurrent } from '@diary-spo/shared'

import type { ApiResponse } from '@types'

import { api } from '../../api.ts'

export const getPerformance = async (): Promise<
  { data: PerformanceCurrent } | ApiResponse
> => api['performance.current'].get()
