import type { Day, Nullable } from '@diary-spo/shared'
import { useState } from 'react'
import { handleResponse, isApiError } from '../../../shared'
import { getUserLessons } from '../../../shared/api'
import { useRateLimitExceeded, useSnackbar } from '../../../shared/hooks'

export const useScheduleData = () => {
  /** Для асинхронных действий **/
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [rateSnackbar, handleRateLimitExceeded] = useRateLimitExceeded()
  const [lessonsState, setLessons] = useState<Nullable<Day[]>>(null)
  const [snackbar, showSnackbar] = useSnackbar()

  const getActualUserLessons = async (start: Date, end: Date) => {
    setIsLoading(true)
    setIsError(false)

    localStorage.setItem('currentDate', start.toString())

    try {
      // @TODO: ??
      const data = await getUserLessons(start, end)

      handleResponse(
        data,
        () => {
          setIsLoading(false)
          setIsError(true)
        },
        handleRateLimitExceeded,
        setIsLoading,
        showSnackbar
      )

      if (isApiError(data)) {
        return
      }

      setLessons(data.data)
      localStorage.setItem('lastLessonsFetchTime', Date.now().toString())
      localStorage.setItem('savedLessons', JSON.stringify(data.data))
    } finally {
      setIsLoading(false)
    }
  }

  return {
    getActualUserLessons,
    isLoading,
    isError,
    rateSnackbar,
    data: lessonsState,
    snackbar,
    showSnackbar,
    setData: setLessons
  }
}
