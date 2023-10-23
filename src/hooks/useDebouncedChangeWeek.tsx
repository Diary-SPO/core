import { useCallback, useState } from 'preact/hooks'

interface SendToServerIfValid {
  (start: Date, end: Date): void
}

const useDebouncedChangeWeek = (
  startDate: Date,
  endDate: Date,
  setIsCurrent: (value: boolean) => void,
  setStartDate: (startDate: Date) => void,
  setEndDate: (endDate: Date) => void
) => {
  const [clickCount, setClickCount] = useState<number>(0)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const debouncedChangeWeek = useCallback(
    (direction: 'prev' | 'next', sendToServerIfValid: SendToServerIfValid) => {
      localStorage.setItem('isCurrent', JSON.stringify(false))
      setIsCurrent(false)
      const newStartDate = new Date(startDate)
      const newEndDate = new Date(endDate)
      if (clickCount > 0) {
        const weekDifference = clickCount * 7
        newStartDate.setDate(newStartDate.getDate() + weekDifference)
        newEndDate.setDate(newEndDate.getDate() + weekDifference)
        setClickCount(0)
      } else if (direction === 'prev') {
        newStartDate.setDate(newStartDate.getDate() - 7)
        newEndDate.setDate(newEndDate.getDate() - 7)
      } else if (direction === 'next') {
        newStartDate.setDate(newStartDate.getDate() + 7)
        newEndDate.setDate(newEndDate.getDate() + 7)
      }

      sendToServerIfValid(newStartDate, newEndDate)
      setStartDate(newStartDate)
      setEndDate(newEndDate)
    },
    [clickCount, startDate, endDate, setIsCurrent, setStartDate, setEndDate]
  )

  const handleButtonClick = (
    direction: 'prev' | 'next',
    sendToServerIfValid: SendToServerIfValid
  ) => {
    setClickCount((prevCount) => prevCount + 1)
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    const newTimeoutId = setTimeout(() => {
      debouncedChangeWeek(direction, sendToServerIfValid)
      setClickCount(0)
    }, 500)

    setTimeoutId(newTimeoutId)
  }

  return { handleButtonClick }
}

export default useDebouncedChangeWeek
