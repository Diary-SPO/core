import type { Nullable } from '@diary-spo/shared'
import { useRef } from 'react'

type SendToServerIfValid = (start: Date, end: Date) => void
type Direction = 'prev' | 'next'

export const useDebouncedChangeWeek = (
  startDate: Date,
  endDate: Date,
  setIsCurrent: (value: boolean) => void,
  setStartDate: (startDate: Date) => void,
  setEndDate: (endDate: Date) => void
) => {
  const clickCountRef = useRef(0)
  const timeoutIdRef = useRef<Nullable<number>>(null)
  const datesRef = useRef({ startDate, endDate })
  datesRef.current = { startDate, endDate }

  const applyWeek = (
    direction: Direction,
    weeks: number,
    sendToServerIfValid: SendToServerIfValid
  ) => {
    localStorage.setItem('isCurrent', JSON.stringify(false))
    setIsCurrent(false)
    const { startDate: from, endDate: to } = datesRef.current
    const newStartDate = new Date(from)
    const newEndDate = new Date(to)
    const delta = weeks * (direction === 'prev' ? -7 : 7)
    newStartDate.setDate(newStartDate.getDate() + delta)
    newEndDate.setDate(newEndDate.getDate() + delta)
    sendToServerIfValid(newStartDate, newEndDate)
    setStartDate(newStartDate)
    setEndDate(newEndDate)
  }

  const changeWeekNow = (
    direction: Direction,
    sendToServerIfValid: SendToServerIfValid
  ) => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current)
      timeoutIdRef.current = null
    }
    clickCountRef.current = 0
    applyWeek(direction, 1, sendToServerIfValid)
  }

  const handleButtonClick = (
    direction: Direction,
    sendToServerIfValid: SendToServerIfValid
  ) => {
    clickCountRef.current += 1
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current)
    }

    timeoutIdRef.current = window.setTimeout(() => {
      applyWeek(direction, clickCountRef.current, sendToServerIfValid)
      clickCountRef.current = 0
      timeoutIdRef.current = null
    }, 500)
  }

  return { handleButtonClick, changeWeekNow }
}
