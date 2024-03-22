import { PerformanceCurrent } from '@diary-spo/shared'
import { ICacheData } from '@helpers'
import { formatDate } from '@utils'
import { getPerformanceCurrent } from 'src/routes/performance.current/service/getPerformanceCurrent'

export const searchCurrStartDate = async (authDate: ICacheData) => {
  const performance = await getPerformanceCurrent(authDate).then(
    (r) => r.json() as unknown as PerformanceCurrent
  )
  let minDate: string | null = null
  for (const DWMFS of performance.daysWithMarksForSubject) {
    if (!DWMFS.daysWithMarks) {
      continue
    }
    for (const day of DWMFS.daysWithMarks) {
      const formatDateString = formatDate(new Date(day.day).toISOString())
      if (!minDate || minDate > formatDateString) {
        minDate = formatDateString
      }
    }
  }
  return minDate
}
