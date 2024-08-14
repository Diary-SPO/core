import type { Nullable } from '@diary-spo/shared'
import { useCallback, useState } from 'react'

/**
 * Функция 'useDebouncedChangeWeek' обрабатывает изменения недели с задержкой.
 * Принимает начальную и конечную даты, устанавливает значения текущей даты, начальной и конечной даты.
 * Создает обработчик для событий клика с учетом задержки и изменения даты.
 * При каждом клике увеличивает счетчик нажатий, а также устанавливает таймер для вызова функции с новыми датами.
 * После задержки сбрасывает счетчик и вызывает функцию, отправляющую измененные даты на сервер.
 */

type SendToServerIfValid = (start: Date, end: Date) => void

const useDebouncedChangeWeek = (
  startDate: Date,
  endDate: Date,
  setIsCurrent: (value: boolean) => void,
  setStartDate: (startDate: Date) => void,
  setEndDate: (endDate: Date) => void
) => {
  const [clickCount, setClickCount] = useState<number>(0)
  const [timeoutId, setTimeoutId] = useState<Nullable<number>>(null)

  const debouncedChangeWeek = useCallback(
    (direction: 'prev' | 'next', sendToServerIfValid: SendToServerIfValid) => {
      localStorage.setItem('isCurrent', JSON.stringify(false))
      setIsCurrent(false)
      const newStartDate = new Date(startDate)
      const newEndDate = new Date(endDate)
      if (clickCount > 0) {
        const isPrev = direction === 'prev'
        const weekDifference = clickCount * (isPrev ? -7 : 7)
        newStartDate.setDate(newStartDate.getDate() + weekDifference)
        newEndDate.setDate(newEndDate.getDate() + weekDifference)
        setClickCount(0)
      } else if (direction === 'prev') {
        console.log('direction', direction)
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
    console.log('direction2', direction)
    setClickCount((prevCount) => prevCount + 1)
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    const timeout = window.setTimeout(() => {
      debouncedChangeWeek(direction, sendToServerIfValid)
      setClickCount(0)
    }, 500)

    setTimeoutId(timeout)
  }

  return { handleButtonClick }
}

export default useDebouncedChangeWeek
